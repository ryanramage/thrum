const { List } = require('immutable')
const SongState = require('../r/songState')
const midi = require('./midi')
const tick = require('../r/tick')

module.exports = (config, dispatchers, tickExpression) => {
  let initialState = SongState.set({spp: 0, userState: {}, actions: []})
  let lastState = initialState
  let futureActions = List([])

  let onClock = (spp, outputs) => {
    let thisState = SongState.set({...lastState, spp, actions: []})
    // clear any future actions. eg: scheduled midi off notes
    futureActions = dispatchMemoActions(spp, futureActions, thisState, {midi: outputs})
    lastState = tick(tickExpression, thisState)
    futureActions = futureActions.concat(dispatch(dispatchers, spp, lastState.actions, {midi: outputs}))
  }

  let onMidi = (msg, outputs) => {
    // console.log('midi received', msg) // do another reducer
  }

  let onStop = (midi) => {
    // clear all notes
    futureActions.forEach(fa => {
      let msg = fa.msg
      if (!msg) return
      let output = msg.output || Object.keys(midi)[0]
      let channel = msg.channel || 0
      let port = midi[output]
      if (!port) return
      port.allNotesOff(channel)
      port.allSoundOff(channel)
    })
  }

  midi(config, onClock, onMidi, onStop)
}

// returns a list of memo (future actions)
function dispatch (dispatchers, spp, actions, context) {
  return List([]).withMutations(futureActions => {
    if (!actions) actions = []
    actions.forEach(a => {
      let to = null
      let msg = null
      if (Array.isArray(a)) {
        to = a[0]
        msg = a[1]
      } else if (a.futureSpp) {
        let futureSpp = a.futureSpp
        delete a.futureSpp
        futureActions.concat({ spp: futureSpp, name: 'midiOn', msg: a })
      } else {
        to = a.to
        msg = a
      }
      if (!to) return
      let fn = dispatchers[to]
      if (!fn) return
      let fa = fn.call(null, spp, msg, context)
      if (fa) futureActions.concat(fa)
      return true
    })
    return futureActions
  })
}

function midiOff (spp, msg, context) {
  let midi = context.midi
  let output = msg.output || Object.keys(midi)[0]
  let channel = msg.channel || 0

  let port = midi[output]
  if (!port) return
  let velocity = msg.velocity || 127
  port.noteOff(channel, msg.note)
}

function dispatchMemoActions (spp, futureActions, state, context) {
  return futureActions.filter(action => {
    if (action.spp !== spp) return true
    if (action.name === 'midiOff') midiOff(spp, action.msg, context)
    if (action.name === 'midiOn') state.actions.push(action.msg)
    return false // so filter works
  })
}
