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
  console.log(JZZ().info().inputs.map(i => i.name))
}
if (!config._[0]) return usage()

let output = null
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
    if (output) {
      for (let i=0; i<16; i++) {
        output.allNotesOff(i)
      }
      output.close()
    }
    console.log('App has quit');
    process.exit();
  }).on('restart', function (files) {
    console.log('App restarted due to: ', files);
  })
}

function midi () {
  if (config.midiThru) {
    if (config.outputs) {
      Object.keys(config.outputs).forEach(out => {
        let name = config.outputs[out]
        console.log('connecting to livecoding output to', name)
        output = JZZ().openMidiOut(name)
      })
    } else {
      // just connect to a single output
      let name = config.out
      console.log('connecting to livecoding output to', name)
      output = JZZ().openMidiOut(name)
    }
  }

  let selectedInput = config.in
  if (!selectedInput) selectedInput = Object.values(config.inputs)[0]
  if (!selectedInput) {
    let inputs = JZZ().info().inputs
    if (inputs || inputs.length) selectedInput = inputs[0].name
  }

  JZZ().or('Cannot start MIDI engine!')
  const input = JZZ().openMidiIn(selectedInput)

  console.log('connected livecoding midi clock on', selectedInput)

  let spp = 0
  let broadcasting = false

  input.connect(msg => {
    if (output) output.send(msg) // send the msg to the out
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
        console.log('MIDI', 'Livecoding Start Received')
        break
      case 0xFB:
        console.log('MIDI', 'Livecoding Continue Received')
        break
      case 0xFC:
        console.log('MIDI', 'Livecoding Stop Received')
        break
      default:
        break
    }
  })

  const server = http.createServer((req, resp) => {
    console.log('got a request', spp)
    let songPosition = Math.floor(spp / 6)
    broadcasting = true
    if (output) output.send(JZZ.MIDI.songPosition(songPosition))
    resp.end('ok')
  })
  server.listen(config.port, err => {
    if (err) console.log(err) && process.exit(1)
    console.log('livecoding reload server running on port', config.port)
  })
}
