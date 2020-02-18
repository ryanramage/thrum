const JZZ = require('jzz')

module.exports = function connect (config, onClock, onMidi) {
  JZZ().or('Cannot start MIDI engine!')
  // console.log('available inputs', JZZ().info().inputs.map(i => i.name))
  // console.log('available outputs', JZZ().info().outputs.map(i => i.name))
  const input = JZZ().openMidiIn(config.input['1'])
  let spp = null
  if (!config.livecoding) spp = 0 // if livecoding, leave this as null. we will get this value later
  let outputs = {}
  input.connect(msg => {
    switch (msg[0]) {
      // Clock
      case 0xF2:
        let a = (msg[2] << 7) + msg[1] // data2 is msb, data1 is lsb
        spp = (a * 6)
        console.log('midi clock received', spp)
        break
      case 0xF8:
        if (spp !== null) onClock(spp++, outputs)
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
        onMidi(msg, outputs)
        break
    }
  })
  if (config.output) {
    Object.keys(config.output).forEach(out => {
      let name = config.output[out]
      console.log('connecting to', name)
      const output = JZZ().openMidiOut(name)
      outputs[out] = output
    })
  }
  // cleanup
  process.on('SIGTERM', () => {
    input.close()
    Object.keys(outputs).forEach(o => {
      outputs[o].close()
    })
  })

  if (config.livecoding) {
    // issue a http call to the livecoding port
    if (inNode()) {
      const options = { hostname: 'localhost', port: 555, path: '/', method: 'GET' }
      const req = require('http').request(options, (res) => {})
      req.on('error', e => console.error(`problem with request: ${e.message}`));
      req.end()
    } else {

    }
  }


}

function inNode() { return typeof process === 'object' && typeof process.versions === 'object' && typeof process.versions.node !== 'undefined'; }
