const test = require('tape')
const Chord = require('../lib/chord.js')

test('works', t => {
  let chord = Chord('CMaj7')
  t.ok(chord)
  let notes = chord.notes(3)
  t.deepEquals(notes ['C3', 'E3', 'G3', 'B3'])
  t.end()
})

test('inversion', t => {
  let chord = Chord('CMaj7')
  t.ok(chord)
  let notes = chord.notes(3, 1)
  t.deepEquals(notes ['E3', 'G3', 'B3', 'C4'])
  t.end()
})

test('inversion with extra notes', t => {
  let chord = Chord('CM')
  t.ok(chord)
  let notes = chord.notes(3, 0, 4)
  t.deepEquals(notes ['C3', 'E3', 'G3', 'C4'])
  t.end()
})
