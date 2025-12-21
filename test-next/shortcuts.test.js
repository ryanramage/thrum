const test = require('tape')
const { kick, snare, house, fourOnFloor, createDrumMap } = require('../lib-next/shortcuts')

test('kick returns a track function', t => {
  const k = kick()
  t.equal(typeof k, 'function', 'kick returns a function')
  t.end()
})

test('pattern compilation handles different lengths correctly', t => {
  const { pattern } = require('../lib-next/pattern')
  
  // Test 8-character pattern (should use 6 ticks per char for 16th notes)
  const eightChar = pattern('x-x-x-x-')
  let state = { bar: 0, beat: 0, tick: 0 }
  let result = eightChar.play(() => ({ type: 'test' }))(state)
  t.equal(result.actions.length, 1, '8-char pattern fires on first position')
  
  // Test 16-character pattern (should use 6 ticks per char)
  const sixteenChar = pattern('x---------------')
  state = { bar: 0, beat: 0, tick: 0 }
  result = sixteenChar.play(() => ({ type: 'test' }))(state)
  t.equal(result.actions.length, 1, '16-char pattern fires on first position')
  
  // Test 4-character pattern (should use 24 ticks per char)
  const fourChar = pattern('x---')
  state = { bar: 0, beat: 0, tick: 0 }
  result = fourChar.play(() => ({ type: 'test' }))(state)
  t.equal(result.actions.length, 1, '4-char pattern fires on first position')
  
  t.end()
})

test('16th note pattern timing is correct', t => {
  const { pattern } = require('../lib-next/pattern')
  
  // 16-char pattern: each char = 6 ticks
  const p = pattern('x-x-x-x-x-x-x-x-')
  
  // Should fire at ticks 0, 12, 24, 36, etc.
  let state = { bar: 0, beat: 0, tick: 0 }
  let result = p.play(() => ({ type: 'test' }))(state)
  t.equal(result.actions.length, 1, 'fires at tick 0')
  
  state = { bar: 0, beat: 0, tick: 6 }
  result = p.play(() => ({ type: 'test' }))(state)
  t.equal(result.actions.length, 0, 'does not fire at tick 6')
  
  state = { bar: 0, beat: 0, tick: 12 }
  result = p.play(() => ({ type: 'test' }))(state)
  t.equal(result.actions.length, 1, 'fires at tick 12')
  
  state = { bar: 0, beat: 1, tick: 0 }
  result = p.play(() => ({ type: 'test' }))(state)
  t.equal(result.actions.length, 1, 'fires at beat 1, tick 0 (position 24)')
  
  t.end()
})

test('beat pattern timing is correct', t => {
  const { pattern } = require('../lib-next/pattern')
  
  // 4-char pattern: each char = 24 ticks
  const p = pattern('x-x-')
  
  // Should fire at ticks 0, 48 (beat 2)
  let state = { bar: 0, beat: 0, tick: 0 }
  let result = p.play(() => ({ type: 'test' }))(state)
  t.equal(result.actions.length, 1, 'fires at beat 0')
  
  state = { bar: 0, beat: 1, tick: 0 }
  result = p.play(() => ({ type: 'test' }))(state)
  t.equal(result.actions.length, 0, 'does not fire at beat 1')
  
  state = { bar: 0, beat: 2, tick: 0 }
  result = p.play(() => ({ type: 'test' }))(state)
  t.equal(result.actions.length, 1, 'fires at beat 2')
  
  t.end()
})

test('pattern wraps correctly across bars', t => {
  const { pattern } = require('../lib-next/pattern')
  
  // 4-char pattern should repeat every 4 beats
  const p = pattern('x---')
  
  // Test first bar
  let state = { bar: 0, beat: 0, tick: 0 }
  let result = p.play(() => ({ type: 'test' }))(state)
  t.equal(result.actions.length, 1, 'fires at bar 0, beat 0')
  
  // Test second bar - should repeat pattern
  state = { bar: 1, beat: 0, tick: 0 }
  result = p.play(() => ({ type: 'test' }))(state)
  t.equal(result.actions.length, 1, 'fires at bar 1, beat 0 (pattern repeats)')
  
  state = { bar: 1, beat: 1, tick: 0 }
  result = p.play(() => ({ type: 'test' }))(state)
  t.equal(result.actions.length, 0, 'does not fire at bar 1, beat 1')
  
  t.end()
})

test('closedHat pattern timing', t => {
  const { closedHat } = require('../lib-next/shortcuts')
  
  const h = closedHat()
  
  // Default pattern is 'x-x-x-x-x-x-x-x-' (16 chars, 6 ticks each)
  // Should fire at positions 0, 12, 24, 36, 48, 60, 72, 84
  
  let state = { bar: 0, beat: 0, tick: 0 }
  let result = h(state)
  t.equal(result.actions.length, 1, 'hihat fires at tick 0')
  
  state = { bar: 0, beat: 0, tick: 12 }
  result = h(state)
  t.equal(result.actions.length, 1, 'hihat fires at tick 12')
  
  state = { bar: 0, beat: 1, tick: 0 }
  result = h(state)
  t.equal(result.actions.length, 1, 'hihat fires at beat 1, tick 0')
  
  state = { bar: 0, beat: 0, tick: 6 }
  result = h(state)
  t.equal(result.actions.length, 0, 'hihat does not fire at tick 6')
  
  t.end()
})

test('empty pattern handling', t => {
  const { pattern } = require('../lib-next/pattern')
  
  const p = pattern('----')
  
  let state = { bar: 0, beat: 0, tick: 0 }
  let result = p.play(() => ({ type: 'test' }))(state)
  t.equal(result.actions.length, 0, 'empty pattern produces no actions')
  
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
