const test = require('tape')
const _tick = require('../../r/tick.js')
const SongState = require('../../r/songState.js')
const {tick, repeat, strum, chord, length, transpose, lfo, cc} = require('../../index.js').meter([4, '4n'])

test('transpose strum a chord', t => {
  // setup
  let result = null
  let tick = exp => result = _tick(exp, SongState.set({spp: 0, userState: {}, actions: []}))

  // raw user section
  let cmStrumed = strum(chord('CM').octave(5))
  tick([
    transpose('4P', repeat('4n', cmStrumed))
  ])

  // testing
  t.ok(result)
  t.equals(result.actions[0].note, 'F5')
  // future notes of the strum
  t.equals(result.actions[1].futureSpp, 3)
  t.equals(result.actions[1].note, 'A5')
  t.equals(result.actions[2].futureSpp, 6)
  t.equals(result.actions[2].note, 'C6')
  t.end()
})

test('cant transpose an lfo', t => {
  // setup
  let result = null
  let tick = exp => result = _tick(exp, SongState.set({spp: 0, userState: {}, actions: []}))

  // raw user section
  tick([
    transpose('4P', lfo('8m', '16n', 'sine', 0, 127, cc(16)))
  ])


  // testing
  t.ok(result)
  t.end()
})
