const test = require('tape')
const { kick, snare, house, fourOnFloor, createDrumMap } = require('../lib-next/shortcuts')

test('kick returns a track function', t => {
  const k = kick()
  t.equal(typeof k, 'function', 'kick returns a function')
  t.end()
})

test('kick executes and returns actions on beat', t => {
  const k = kick()
  const state = { bar: 0, beat: 0, tick: 0 }
  const result = k(state)
  
  t.ok(result, 'result exists')
  t.ok(result.actions, 'result has actions')
  t.equal(result.actions.length, 1, 'one action on first beat')
  t.equal(result.actions[0].type, 'note', 'action is a note')
  t.equal(result.actions[0].note, 'C1', 'note is C1 (kick)')
  t.equal(result.actions[0].channel, 9, 'channel is 9 (drum channel)')
  t.end()
})

test('kick does not fire on off-beat', t => {
  const k = kick()
  const state = { bar: 0, beat: 0, tick: 12 }
  const result = k(state)
  
  t.equal(result.actions.length, 0, 'no actions on off-beat')
  t.end()
})

test('kick with custom pattern', t => {
  const k = kick({ pattern: 'x-x-' })
  
  // First beat - should fire
  let state = { bar: 0, beat: 0, tick: 0 }
  let result = k(state)
  t.equal(result.actions.length, 1, 'fires on first beat')
  
  // Second beat - should not fire
  state = { bar: 0, beat: 1, tick: 0 }
  result = k(state)
  t.equal(result.actions.length, 0, 'does not fire on second beat')
  
  // Third beat - should fire
  state = { bar: 0, beat: 2, tick: 0 }
  result = k(state)
  t.equal(result.actions.length, 1, 'fires on third beat')
  
  t.end()
})

test('kick with custom velocity', t => {
  const k = kick({ velocity: 127 })
  const state = { bar: 0, beat: 0, tick: 0 }
  const result = k(state)
  
  t.equal(result.actions[0].velocity, 127, 'custom velocity applied')
  t.end()
})

test('kick with custom note', t => {
  const k = kick({ note: 'C2' })
  const state = { bar: 0, beat: 0, tick: 0 }
  const result = k(state)
  
  t.equal(result.actions[0].note, 'C2', 'custom note applied')
  t.end()
})

test('kick with custom drum map', t => {
  const myDrums = createDrumMap({ kick: 'D2' })
  const k = kick({ drumMap: myDrums })
  const state = { bar: 0, beat: 0, tick: 0 }
  const result = k(state)
  
  t.equal(result.actions[0].note, 'D2', 'custom drum map applied')
  t.end()
})

test('house returns a combined track function', t => {
  const h = house()
  t.equal(typeof h, 'function', 'house returns a function')
  
  const state = { bar: 0, beat: 0, tick: 0 }
  const result = h(state)
  
  t.ok(result.actions, 'result has actions')
  t.ok(result.actions.length > 0, 'multiple drums fire on first beat')
  t.end()
})

test('fourOnFloor combines kick, snare, and hihat', t => {
  const beat = fourOnFloor()
  const state = { bar: 0, beat: 0, tick: 0 }
  const result = beat(state)
  
  t.ok(result.actions.length >= 2, 'multiple drums fire (kick + hihat at minimum)')
  
  // Check that we have different drum notes
  const notes = result.actions.map(a => a.note)
  const uniqueNotes = [...new Set(notes)]
  t.ok(uniqueNotes.length > 1, 'multiple different drums playing')
  t.end()
})

test('snare fires on beats 2 and 4', t => {
  const s = snare()
  
  // Beat 0 - no snare
  let state = { bar: 0, beat: 0, tick: 0 }
  let result = s(state)
  t.equal(result.actions.length, 0, 'no snare on beat 1')
  
  // Beat 1 (second beat) - snare fires
  state = { bar: 0, beat: 1, tick: 0 }
  result = s(state)
  t.equal(result.actions.length, 1, 'snare on beat 2')
  
  // Beat 2 - no snare
  state = { bar: 0, beat: 2, tick: 0 }
  result = s(state)
  t.equal(result.actions.length, 0, 'no snare on beat 3')
  
  // Beat 3 (fourth beat) - snare fires
  state = { bar: 0, beat: 3, tick: 0 }
  result = s(state)
  t.equal(result.actions.length, 1, 'snare on beat 4')
  
  t.end()
})
