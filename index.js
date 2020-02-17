const rc = require('rc')
exports.midi = require('./lib/midi')
const lengths = require('./lib/lengths')
exports.operators = require('./lib/operators')
exports.setup = (options) => rc('forca', options)

exports.connect = (config, initialState, dispatchers, onClockFunction) => {
  let lastState = initialState
  let onClock = (spp, outputs) => {
    let {actions, state} = onClockFunction({state: lastState, spp})
    exports.dispatch(dispatchers, actions, state, {midi: outputs})
    lastState = state // we should clone this
  }

  let onMidi = (msg, outputs) => {
    // console.log('midi received', msg) // do another reducer
  }
  exports.midi(config, onClock, onMidi)
}

exports.bars = ({state, spp}, baseTimeSignature, structureArray) => {
  let nextSPP = 0
  let [beatsPerBar, noteLength] = baseTimeSignature
  let byStartSPP = structureArray.map(part => {
    let [barCount, barFunc] = part
    nextSPP = nextSPP + (barCount * (beatsPerBar * lengths[noteLength]))
    let thisBarStartSPP = nextSPP - 1
    return [thisBarStartSPP, barFunc]
  })

  for (var i = 0; i < byStartSPP.length; i++) {
    let [thisBarStartSPP, barFunc] = byStartSPP[i]
    if (spp <= thisBarStartSPP) return barFunc({state, spp})
  }
  return {state, actions: []} // no bars. just default
}

exports.dispatch = (dispatchers, actions, state, context) => {
  if (!actions) actions = []
  actions.forEach(a => {
    let to = a[0]
    let msg = a[1]
    if (!to) return
    let fn = dispatchers[to]
    if (!fn) return
    fn.call(null, msg, state, context)
  })
}

exports.toMidi = (msg, state, context) => {
  let midi = context.midi
  let output = msg.output || Object.keys(midi)[0]
  let channel = msg.channel || 0

  let port = midi[output]
  if (!port) return
  let velocity = msg.velocity || 127
  let length = msg.length || 50
  port.note(channel, msg.note, velocity, length)
}

exports.onBeat = (spp, name) => {
  let base = lengths[name]
  return (spp % base === 0)
}
