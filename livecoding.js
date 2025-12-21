#!/usr/bin/env node
const JZZ = require('jzz')
const fs = require('fs')
const path = require('path')
const http = require('http')
const config = require('rc')('thrum', {
  port: 5551,
  inputs: {}
})

let currentSong = null
let musicFilePath = null
let midiOut = null
let tempo = 120 // Default tempo, can be overridden by song

function loadMusicFile(filePath) {
  try {
    // Clear the require cache to reload the module
    const resolvedPath = require.resolve(path.resolve(filePath))
    delete require.cache[resolvedPath]
    
    // Also clear cache for any thrum modules that might be cached
    Object.keys(require.cache).forEach(key => {
      if (key.includes('thrum') && !key.includes('node_modules')) {
        delete require.cache[key]
      }
    })
    
    // Load the music file
    const musicModule = require(path.resolve(filePath))
    currentSong = musicModule
    
    // Update tempo if song provides it
    if (currentSong.tempo) {
      tempo = currentSong.tempo
      console.log('Updated tempo to:', tempo)
    }
    
    console.log('Loaded music file:', filePath)
    return true
  } catch (error) {
    console.error('Error loading music file:', error.message)
    console.error(error.stack)
    return false
  }
}

function watchMusicFile(filePath) {
  console.log('Watching file for changes:', filePath)
  
  fs.watch(filePath, (eventType, filename) => {
    if (eventType === 'change') {
      console.log('File changed, reloading...')
      loadMusicFile(filePath)
    }
  })
}

function startLiveCoding(filePath) {
  musicFilePath = path.resolve(filePath)
  
  // Check if file exists
  if (!fs.existsSync(musicFilePath)) {
    console.error('File not found:', musicFilePath)
    process.exit(1)
  }
  
  // Initial load
  if (!loadMusicFile(musicFilePath)) {
    console.error('Failed to load music file')
    process.exit(1)
  }
  
  // Watch for changes
  watchMusicFile(musicFilePath)
  
  // Initialize MIDI
  initMIDI()
}

function initMIDI() {
  console.log('MIDI: Initializing...')
  
  JZZ().or(function(err) {
    console.error('MIDI: Cannot start engine!', err)
    process.exit(1)
  }).and(function(jzz) {
    console.log('MIDI: Engine initialized:', jzz.info().engine)
    
    // Find input
    let selectedInput = config.in
    if (!selectedInput) {
      const inputs = jzz.info().inputs
      if (inputs && inputs.length) selectedInput = inputs[0].name
    }
    
    if (!selectedInput) {
      console.error('MIDI: No input found')
      console.log('Available inputs:', jzz.info().inputs)
      process.exit(1)
    }
    
    // Find output
    let selectedOutput = config.out
    if (!selectedOutput) {
      const outputs = jzz.info().outputs
      if (outputs && outputs.length) selectedOutput = outputs[0].name
    }
    
    console.log('MIDI: Opening input:', selectedInput)
    if (selectedOutput) {
      console.log('MIDI: Opening output:', selectedOutput)
    } else {
      console.log('MIDI: No output configured (will not send MIDI)')
    }
    
    jzz.openMidiIn(selectedInput).or(function(err) {
      console.error('MIDI: Failed to open input:', err)
      process.exit(1)
    }).and(function(midiIn) {
      console.log('MIDI: Input opened successfully')
      
      // Open output if configured
      if (selectedOutput) {
        midiOut = jzz.openMidiOut(selectedOutput)
        console.log('MIDI: Output opened successfully')
      }
      
      let spp = 0 // Song position in ticks
      let lastLoggedBeat = -1
      
      midiIn.connect(function(msg) {
        switch (msg[0]) {
          case 0xF8: // Clock tick
            spp++
            onClockTick(spp)
            
            // Log every beat for debugging
            const currentBeat = Math.floor(spp / 24)
            if (currentBeat !== lastLoggedBeat) {
              console.log('Beat:', currentBeat, 'Bar:', Math.floor(currentBeat / 4))
              lastLoggedBeat = currentBeat
            }
            break
          case 0xFA: // Start
            console.log('MIDI: Start received')
            spp = 0
            lastLoggedBeat = -1
            break
          case 0xFB: // Continue
            console.log('MIDI: Continue received')
            break
          case 0xFC: // Stop
            console.log('MIDI: Stop received')
            // Send all notes off
            if (midiOut) {
              for (let i = 0; i < 16; i++) {
                midiOut.send([0xB0 + i, 123, 0]) // All Notes Off
                midiOut.send([0xB0 + i, 120, 0]) // All Sound Off
              }
            }
            break
          case 0xF2: // Song Position Pointer
            const songPosition = (msg[2] << 7) + msg[1]
            spp = songPosition * 6
            lastLoggedBeat = -1
            console.log('MIDI: SPP received:', spp, 'ticks')
            break
        }
      })
      
      console.log('MIDI: Ready and listening for clock messages')
      console.log('HTTP: Reload server running on port', config.port)
      console.log('HTTP: Send GET request to http://localhost:' + config.port + ' to trigger reload')
      
      // HTTP reload endpoint
      const server = http.createServer(function(req, resp) {
        console.log('HTTP: Reload requested')
        if (loadMusicFile(musicFilePath)) {
          resp.end('ok - reloaded')
        } else {
          resp.end('error - check console')
        }
      })
      server.listen(config.port, function(err) {
        if (err) {
          console.error('HTTP: Failed to start server:', err)
          process.exit(1)
        }
      })
    })
  })
}

function onClockTick(spp) {
  if (!currentSong) return
  
  // Calculate bar, beat, tick from spp
  const tick = spp % 24
  const beat = Math.floor(spp / 24) % 4
  const bar = Math.floor(spp / 96)
  
  const state = {
    tick,
    beat,
    bar,
    absoluteTick: spp
  }
  
  try {
    // Execute the song
    const result = currentSong.tick ? currentSong.tick(state) : null
    
    // Send MIDI messages
    if (result && result.actions && midiOut) {
      result.actions.forEach(function(action) {
        if (action.type === 'note') {
          const channel = action.channel !== undefined ? action.channel : 0
          const velocity = action.velocity !== undefined ? action.velocity : 100
          const note = action.note
          const length = action.length !== undefined ? action.length : 24
          
          // Send note on
          midiOut.send([0x90 + channel, note, velocity])
          
          // Calculate note off time in milliseconds
          // At 120 BPM: 1 beat = 500ms, 1 tick = 500/24 = ~20.83ms
          const msPerTick = (60000 / tempo) / 24
          const noteOffTime = length * msPerTick
          
          // Schedule note off
          setTimeout(function() {
            midiOut.send([0x80 + channel, note, 0])
          }, noteOffTime)
        }
      })
    }
  } catch (error) {
    console.error('Error executing song:', error.message)
    console.error(error.stack)
  }
}

// Handle graceful shutdown
process.on('SIGINT', function() {
  console.log('\nShutting down...')
  
  // Send all notes off
  if (midiOut) {
    for (let i = 0; i < 16; i++) {
      midiOut.send([0xB0 + i, 123, 0])
      midiOut.send([0xB0 + i, 120, 0])
    }
  }
  
  process.exit(0)
})

// Start
if (!config._[0]) {
  console.log('Usage: thrum file.js')
  console.log('Available MIDI ports:')
  
  JZZ().or('Cannot start MIDI engine!').and(function(jzz) {
    const info = jzz.info()
    console.log('\nInputs:')
    if (info.inputs && info.inputs.length > 0) {
      info.inputs.forEach(function(input) {
        console.log('  -', input.name)
      })
    } else {
      console.log('  (none)')
    }
    
    console.log('\nOutputs:')
    if (info.outputs && info.outputs.length > 0) {
      info.outputs.forEach(function(output) {
        console.log('  -', output.name)
      })
    } else {
      console.log('  (none)')
    }
    
    console.log('\nConfigure with .thrumrc file:')
    console.log('{')
    console.log('  "in": "Your MIDI Input Name",')
    console.log('  "out": "Your MIDI Output Name"')
    console.log('}')
  })
} else {
  startLiveCoding(config._[0])
}
