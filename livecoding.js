#!/usr/bin/env node
const JZZ = require('jzz')
const path = require('path')
const fs = require('fs')
const http = require('http')
const nodemon = require('nodemon');
const config = require('rc')('thrum', {
  port: 5551,
  inputs: {}
})

function usage() {
  console.log('Usage: thrum file.js')
  console.log('Available midi ports:')
  
  try {
    console.log('DEBUG: Initializing MIDI engine...')
    JZZ().or('Cannot start MIDI engine!')
    console.log('DEBUG: MIDI engine initialized successfully')
    
    const midiInfo = JZZ().info()
    console.log('DEBUG: MIDI info object:', midiInfo)
    console.log('DEBUG: Raw inputs array:', midiInfo.inputs)
    
    if (midiInfo.inputs && midiInfo.inputs.length > 0) {
      console.log('DEBUG: Found', midiInfo.inputs.length, 'inputs')
      console.log(midiInfo.inputs.map(i => i.name))
    } else {
      console.log('DEBUG: No MIDI inputs found or inputs array is empty')
      console.log('DEBUG: Inputs type:', typeof midiInfo.inputs)
      console.log('DEBUG: Inputs length:', midiInfo.inputs ? midiInfo.inputs.length : 'undefined')
    }
  } catch (error) {
    console.log('DEBUG: Error during MIDI initialization:', error)
  }
}
if (!config._[0]) return usage()

let outputs = {}
midi()
watch()


function watch () {
  let selectedInput = config._[0]
  if (!selectedInput) {
    console.log('No watch files provided.')
    return
  }

  // users can just npm i thrum -g,
  // to save the user a npm i (in the thrum dir)
  // we add the __filename to the node_path env variable
  let node_path = path.resolve(__filename, '../..')
  nodemon({
    script: selectedInput,
    env: {
      'NODE_PATH': node_path
    }
  })
  nodemon.on('start', function () {
    console.log('App has started');
  }).on('quit', function () {
    // Clean up all MIDI outputs
    Object.keys(outputs).forEach(key => {
      let output = outputs[key]
      if (output) {
        for (let i=0; i<16; i++) {
          output.send([0xB0 + i, 123, 0]) // All Notes Off
          output.send([0xB0 + i, 120, 0]) // All Sound Off
        }
        output.close()
      }
    })
    console.log('App has quit');
    process.exit();
  }).on('restart', function (files) {
    console.log('App restarted due to: ', files);
  })
}

function midi () {
  JZZ().or('Cannot start MIDI engine!')
  
  if (config.midiThru) {
    if (config.outputs) {
      Object.keys(config.outputs).forEach(out => {
        let name = config.outputs[out]
        console.log('connecting to livecoding output to', name)
        outputs[out] = JZZ().openMidiOut(name)
      })
    } else {
      // just connect to a single output
      let name = config.out
      console.log('connecting to livecoding output to', name)
      outputs['default'] = JZZ().openMidiOut(name)
    }
  }

  let selectedInput = config.in
  if (!selectedInput) selectedInput = Object.values(config.inputs)[0]
  if (!selectedInput) {
    let inputs = JZZ().info().inputs
    if (inputs && inputs.length) selectedInput = inputs[0].name
  }

  if (!selectedInput) {
    console.log('No MIDI input found')
    usage()
    return
  }

  console.log('MIDI', 'Attempting to connect to input:', selectedInput)
  const input = JZZ().openMidiIn(selectedInput)

  console.log('MIDI', 'Connected to input:', selectedInput)
  console.log('MIDI', 'Available inputs:', JZZ().info().inputs.map(i => i.name).join(', '))
  if (Object.keys(outputs).length > 0) {
    console.log('MIDI', 'Connected outputs:', Object.keys(outputs).map(key => `${key}: ${config.outputs ? config.outputs[key] : config.out}`).join(', '))
  } else {
    console.log('MIDI', 'No MIDI outputs configured (midiThru disabled)')
  }

  let spp = 0
  let broadcasting = false

  input.connect(msg => {
    // Log ALL incoming MIDI messages for debugging
    console.log('MIDI', `Raw message received: [${msg.map(b => '0x' + b.toString(16).toUpperCase()).join(', ')}]`)
    
    // send the msg to all outputs
    Object.keys(outputs).forEach(key => {
      if (outputs[key]) outputs[key].send(msg)
    })
    
    switch (msg[0]) {
      // Clock
      case 0xF2:
        let songPosition = (msg[2] << 7) + msg[1] // data2 is msb, data1 is lsb
        console.log('MIDI', `Song Position Pointer received: ${songPosition} (SPP: ${songPosition * 6})`)
        if (broadcasting) {
          console.log('MIDI', 'Ignoring SPP - currently broadcasting')
          broadcasting = false
        } else {
          spp = (songPosition * 6)
          console.log('MIDI', `SPP updated to: ${spp}`)
        }
        break
      case 0xF8:
        spp++
        // Log every 24 ticks (1 beat) to avoid spam
        if (spp % 24 === 0) {
          console.log('MIDI', `Clock tick - SPP: ${spp} (beat: ${Math.floor(spp / 24)})`)
        }
        break
      case 0xFA:
        console.log('MIDI', 'Start Received - SPP reset to 0')
        spp = 0
        break
      case 0xFB:
        console.log('MIDI', 'Continue Received')
        break
      case 0xFC:
        console.log('MIDI', 'Stop Received')
        break
      default:
        // Log other MIDI messages for debugging
        if (msg[0] >= 0xF0) {
          console.log('MIDI', `System message: 0x${msg[0].toString(16).toUpperCase()}`, msg)
        }
        break
    }
  })

  const server = http.createServer((req, resp) => {
    let songPosition = Math.floor(spp / 6)
    console.log('HTTP', `Reload request received - Current SPP: ${spp}, Song Position: ${songPosition}`)
    broadcasting = true
    
    if (Object.keys(outputs).length > 0) {
      Object.keys(outputs).forEach(key => {
        if (outputs[key]) {
          console.log('MIDI', `Sending SPP ${songPosition} to output: ${key}`)
          outputs[key].send(JZZ.MIDI.songPosition(songPosition))
        }
      })
    } else {
      console.log('MIDI', 'No outputs to send SPP to')
    }
    
    resp.end('ok')
  })
  server.listen(config.port, err => {
    if (err) console.log(err) && process.exit(1)
    console.log('HTTP', `Livecoding reload server running on port ${config.port}`)
    console.log('HTTP', `Send GET request to http://localhost:${config.port} to trigger reload`)
  })
}
