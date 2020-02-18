#!/usr/bin/env node
const JZZ = require('jzz')
const http = require('http')
const config = require('rc')('clock', {
  port: 555
})

let selectedInput = config._[0]
if (!selectedInput) {
  let inputs = JZZ().info().inputs
  if (inputs || inputs.length) selectedInput = inputs[0].name
}

JZZ().or('Cannot start MIDI engine!')
const input = JZZ().openMidiIn(selectedInput)
const output = JZZ().openMidiOut(selectedInput)

console.log('connected to midi clock on', selectedInput)

let spp = 0
let broadcasting = false

input.connect(msg => {
  switch (msg[0]) {
    // Clock
    case 0xF2:
      let songPosition = (msg[2] << 7) + msg[1] // data2 is msb, data1 is lsb
      if (broadcasting) broadcasting = false
      else spp = (songPosition * 6)
      break
    case 0xF8:
      spp++
      break
    case 0xFA:
      console.log('MIDI', 'Start Received')
      break
    case 0xFB:
      console.log('MIDI', 'Continue Received')
      break
    case 0xFC:
      console.log('MIDI', 'Stop Received')
      break
    default:
      break
  }
})

const server = http.createServer((req, resp) => {
  let songPosition = Math.floor(spp / 6)
  broadcasting = true
  output.send(JZZ.MIDI.songPosition(songPosition))
  resp.end('ok')
})
server.listen(config.port, err => {
  if (err) console.log(err) && process.exit(1)
  console.log('livecoding reload server running on port', config.port)
})
