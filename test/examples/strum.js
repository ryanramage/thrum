const test = require('tape')
const _tick = require('../../r/tick.js')
const SongState = require('../../r/songState.js')
const {tick, repeat, strum, chord, length} = require('../../index.js').meter([4, '4n'])

test('strum a chord', t => {
  // setup
  let result = null
  let tick = exp => result = _tick(exp, SongState.set({spp: 0, userState: {}, actions: []}))

  // raw user section
  tick([
    repeat('4n', strum(chord('CM').octave(5))) // length and velocity
  ])

  // testing
  t.ok(result)
  t.equals(result.actions[0].note, 'C5')
  // future notes of the strum
  t.equals(result.actions[1].futureSpp, 3)
  t.equals(result.actions[1].note, 'E5')
  t.equals(result.actions[2].futureSpp, 6)
  t.equals(result.actions[2].note, 'G5')

  t.end()
})

test('strum a chord, widen the spread', t => {
  // setup
  let result = null
  let tick = exp => result = _tick(exp, SongState.set({spp: 0, userState: {}, actions: []}))

  // raw user section
  tick([
    repeat('4n', strum({spread: 6}, chord('CM').octave(5))) // length and velocity
  ])

  // testing
  t.ok(result)
  t.equals(result.actions[0].note, 'C5')
  // future notes of the strum
  t.equals(result.actions[1].futureSpp, 6)
  t.equals(result.actions[1].note, 'E5')
  t.equals(result.actions[2].futureSpp, 12)
  t.equals(result.actions[2].note, 'G5')

  t.end()
})

test('play a chord, no spread', t => {
  // setup
  let result = null
  let tick = exp => result = _tick(exp, SongState.set({spp: 0, userState: {}, actions: []}))

  // raw user section
  tick([
    repeat('4n', strum({spread: 0}, chord('CM').octave(5))) // length and velocity
  ])

  // testing
  t.ok(result)
  t.equals(result.actions[0].note, 'C5')
  // future notes of the strum
  t.equals(result.actions[1].note, 'E5')
  t.equals(result.actions[2].note, 'G5')

  t.end()
})
