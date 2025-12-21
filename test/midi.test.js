const test = require('tape')
const  midi = require('../lib/midi.js')

test('midi.note - creates a note action', t => {
  const noteFunc = midi.note('C4')
  const action = noteFunc({ bar: 0, beat: 0, tick: 0 })
  
  t.equals(action.type, 'note', 'type is note')
  t.equals(action.note, 'C4', 'note value correct')
  t.equals(action.velocity, 100, 'default velocity is 100')
  t.equals(action.length,24, 'default length is 24 ticks')
  t.equals(action.channel, 0, 'default channel is 0')
  
  t.end()
})

test('midi.note - accepts options', t => {
  const noteFunc = midi.note('D4', { 
    velocity: 80, 
    length: 48, 
    channel: 1 
  })
  const action = noteFunc({ bar: 0, beat: 0, tick: 0 })
  
  t.equals(action.velocity, 80, 'custom velocity')
  t.equals(action.length, 48, 'custom length')
  t.equals(action.channel, 1, 'custom channel')
  
  t.end()
})

test('midi.chord - creates multiple note actions', t => {
  const chordFunc = midi.chord(['C4', 'E4', 'G4'])
  const actions = chordFunc({ bar: 0, beat: 0, tick: 0 })
  
  t.ok(Array.isArray(actions), 'returns array')
  t.equals(actions.length, 3, 'three notes in chord')
  t.equals(actions[0].note, 'C4', 'first note')
  t.equals(actions[1].note, 'E4', 'second note')
  t.equals(actions[2].note, 'G4', 'third note')
  
  t.end()
})

test('midi.chord - supports spread option', t => {
  const chordFunc = midi.chord(['C4', 'E4', 'G4'], { spread: 5 })
  const actions = chordFunc({ bar: 0, beat: 0, tick: 0 })
  
  t.equals(actions[0].delay, 0, 'first note no delay')
  t.equals(actions[1].delay, 5, 'second note delayed 5 ticks')
  t.equals(actions[2].delay, 10, 'third note delayed 10 ticks')
  
  t.end()
})

test('midi.cc - creates a CC action', t => {
  const ccFunc = midi.cc(7, 64)
  const action = ccFunc({ bar: 0, beat: 0, tick: 0 })
  
  t.equals(action.type, 'cc', 'type is cc')
  t.equals(action.controller, 7, 'controller number')
  t.equals(action.value, 64, 'controller value')
  t.equals(action.channel, 0, 'default channel')
  
  t.end()
})
