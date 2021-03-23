const test = require('tape')
const _tick = require('../../r/tick.js')
const SongState = require('../../r/songState.js')
const {lfo, cc} = require('../../index.js').meter([4, '4n'])

test('lfo a sine wave starts a 0, output to cc 16, channel 0', t => {
  // setup
  let result = null
  let tick = exp => result = _tick(exp, SongState.set({spp: 0, userState: {}, actions: []}))

  // raw user section
  tick([
    lfo('8m', '16n', 'sine', 0, 127, cc(16))
  ])

  // testing
  t.ok(result)
  t.equals(result.actions[0].to, 'toCC')
  t.equals(result.actions[0].channel, 0)
  t.equals(result.actions[0].knob, 16)
  t.equals(result.actions[0].value, 0)
  t.end()
})

test('lfo a sine wave starts a 0, output to cc 16, channel 1', t => {
  // setup
  let result = null
  let tick = exp => result = _tick(exp, SongState.set({spp: 0, userState: {}, actions: []}))

  // raw user section
  tick([
    lfo('8m', '16n', 'sine', 0, 127, cc({channel: 1}, 16))
  ])

  // testing
  t.ok(result)
  t.equals(result.actions[0].to, 'toCC')
  t.equals(result.actions[0].channel, 1)
  t.equals(result.actions[0].knob, 16)
  t.equals(result.actions[0].value, 0)
  t.end()
})


test('lfo a sawtooth wave starts a 0, output to cc 16', t => {
  // setup
  let result = null
  let tick = exp => result = _tick(exp, SongState.set({spp: 0, userState: {}, actions: []}))

  // raw user section
  tick([
    lfo('8m', '16n', 'sawtooth', 0, 127, cc(16))
  ])

  // testing
  t.ok(result)
  t.equals(result.actions[0].to, 'toCC')
  t.equals(result.actions[0].channel, 0)
  t.equals(result.actions[0].knob, 16)
  t.equals(result.actions[0].value, 0)
  t.end()
})

test('lfo only is called on the sample subdivision', t => {
  // setup
  let result = null
  let tick = exp => result = _tick(exp, SongState.set({spp: 1, userState: {}, actions: []}))

  // raw user section
  tick([
    lfo('8m', '16n', 'sawtooth', 0, 127, cc(16))
  ])

  // testing
  t.ok(result)
  t.equals(result.actions.length, 0)
  t.end()
})

test('lfo with invalid shape does not fire', t => {
  // setup
  let result = null
  let tick = exp => result = _tick(exp, SongState.set({spp: 0, userState: {}, actions: []}))

  // raw user section
  tick([
    lfo('8m', '16n', 'DOESNOTEXIST', 0, 127, cc(16))
  ])

  // testing
  t.ok(result)
  t.equals(result.actions.length, 0)
  t.end()
})
