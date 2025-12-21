#!/usr/bin/env node
const JZZ = require('jzz')
const config = require('rc')('thrum', {
  inputs: {}
})

function usage() {
  console.log('Usage: node midi-dump.js')
  console.log('Available midi ports:')
  console.log(JZZ().info().inputs.map(i => i.name))
}

function midiDump() {
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
  JZZ().or('Cannot start MIDI engine!')
  const input = JZZ().openMidiIn(selectedInput)

  console.log('MIDI DUMP - Connected to input:', selectedInput)
  console.log('Available inputs:', JZZ().info().inputs.map(i => i.name).join(', '))
  console.log('Listening for MIDI messages... (Press Ctrl+C to exit)')
  console.log('---')

  input.connect(msg => {
    const timestamp = new Date().toISOString()
    const hex = msg.map(b => '0x' + b.toString(16).toUpperCase().padStart(2, '0')).join(' ')
    const decimal = msg.join(' ')
    
    console.log(`[${timestamp}] Raw: [${hex}] (${decimal})`)
    
    // Decode common MIDI messages
    switch (msg[0]) {
      case 0xF2:
        let songPosition = (msg[2] << 7) + msg[1]
        console.log(`  → Song Position Pointer: ${songPosition} (SPP ticks: ${songPosition * 6})`)
        break
      case 0xF8:
        console.log(`  → MIDI Clock`)
        break
      case 0xFA:
        console.log(`  → Start`)
        break
      case 0xFB:
        console.log(`  → Continue`)
        break
      case 0xFC:
        console.log(`  → Stop`)
        break
      case 0xFE:
        console.log(`  → Active Sensing`)
        break
      case 0xFF:
        console.log(`  → System Reset`)
        break
      default:
        if (msg[0] >= 0x80 && msg[0] <= 0xEF) {
          const channel = (msg[0] & 0x0F) + 1
          const command = msg[0] & 0xF0
          switch (command) {
            case 0x80:
              console.log(`  → Note Off: Ch${channel} Note${msg[1]} Vel${msg[2]}`)
              break
            case 0x90:
              console.log(`  → Note On: Ch${channel} Note${msg[1]} Vel${msg[2]}`)
              break
            case 0xB0:
              console.log(`  → Control Change: Ch${channel} CC${msg[1]} Val${msg[2]}`)
              break
            case 0xC0:
              console.log(`  → Program Change: Ch${channel} Program${msg[1]}`)
              break
            case 0xE0:
              const pitchBend = (msg[2] << 7) + msg[1]
              console.log(`  → Pitch Bend: Ch${channel} Value${pitchBend}`)
              break
            default:
              console.log(`  → Channel message: Ch${channel}`)
              break
          }
        } else if (msg[0] >= 0xF0) {
          console.log(`  → System message: 0x${msg[0].toString(16).toUpperCase()}`)
        }
        break
    }
    console.log('')
  })
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down MIDI dump...')
  process.exit(0)
})

midiDump()
