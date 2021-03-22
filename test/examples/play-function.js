const test = require('tape')
const _tick = require('../../r/tick.js')
const SongState = require('../../r/songState.js')
const {chord, repeat, play, length} = require('../../index.js').meter([4, '4n'])

test('play a single note, velocity is 10', t => {
  // setup
  let result = null
  let tick = exp => result = _tick(exp, SongState.set({spp: 0, userState: {}, actions: []}))

  // raw user section
  tick([
    repeat('4n', play(length('32n', 10),  'C4')) // length and velocity
  ])

  // testing
  t.ok(result)
  t.equals(result.actions[0].note, 'C4')
  t.equals(result.actions[0].length, 3) // very short 32 note
  t.equals(result.actions[0].velocity, 10) // velocity
  t.end()
})

test('play can use a function to get a note', t => {
  // setup
  let result = null
  let tick = exp => result = _tick(exp, SongState.set({spp: 0, userState: {}, actions: []}))

  // raw user section
  let getNote = i => {
    let notes = ['A5', 'G4']
    return notes[i]
  }
  tick([
    repeat('4n', play(getNote))
  ])

  // testing
  t.ok(result)
  t.equals(result.actions[0].note, 'A5')
  t.equals(result.actions[0].length, 24)
  t.end()
})

test('play can use a length function to change length of note', t => {
  // setup
  let result = null
  let tick = exp => result = _tick(exp, SongState.set({spp: 0, userState: {}, actions: []}))

  // raw user section
  let getNote = i => {
    let notes = ['A5', 'G4']
    return notes[i]
  }
  tick([
    repeat('4n', play(length('32n'), getNote))
  ])

  // testing
  t.ok(result)
  t.equals(result.actions[0].note, 'A5')
  t.equals(result.actions[0].length, 3) // very short 32 note
  t.end()
})
