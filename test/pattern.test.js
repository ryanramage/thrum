const test = require('tape')
const { pattern, euclidean }  = require('../lib/pattern.js')

test('pattern - creates a pattern from string', t => {
  const p = pattern('x---')
  
  t.ok(p, 'pattern created')
  t.ok(p.play, 'pattern has play method')
  
  t.end()
})

test('pattern - triggers on x positions', t => {
  const p = pattern('x---')
  let triggered = false
  
  const track = p.play((state) => {
    triggered = true
    return { note: 'C4' }
  })
  
  const result = track({ bar: 0, beat: 0, tick: 0 })
  
  t.ok(triggered, 'triggered on first position')
  t.equals(result.actions.length, 1, 'one action generated')
  
  t.end()
})

test('pattern - does not trigger on - positions', t => {
  const p = pattern('x---')
  let triggered = false
  
  const track = p.play((state) => {
    triggered = true
    return { note: 'C4' }
  })
  
  const result = track({ bar: 0, beat: 0, tick: 24 })
  
  t.notOk(triggered, 'not triggered on rest position')
  t.equals(result.actions.length, 0, 'no actions generated')
  
  t.end()
})

test('pattern - repeats pattern', t => {
  const p = pattern('x-')
  
  const track = p.play((state) => ({ note: 'C4' }))
  
  // Position 0 (x)
  let result = track({ bar: 0, beat: 0, tick: 0 })
  t.equals(result.actions.length, 1, 'triggers at position 0')
  
  // Position 24 (-)
  result = track({ bar: 0, beat: 0, tick: 24 })
  t.equals(result.actions.length, 0, 'no trigger at position 24')
  
  // Position 48 (x again, pattern repeats)
  result = track({ bar: 0, beat: 0, tick: 48 })
  t.equals(result.actions.length, 1, 'triggers at position 48 (repeat)')
  
  t.end()
})

test('pattern.euclidean - generates euclidean rhythm', t => {
  const p = euclidean(3, 8)
  
  t.ok(p, 'euclidean pattern created')
  t.ok(p.play, 'has play method')
  
  t.end()
})
