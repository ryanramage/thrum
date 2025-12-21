const test = require('tape')
const structure = require('../lib/structure.js')

test('structure.bars - triggers at start of bar count', t => {
  let triggered = false
  
  const track = structure.bars(4, (state) => {
    triggered = true
    return { actions: [] }
  })
  
  track({ bar: 0, beat: 0, tick: 0 })
  t.ok(triggered, 'triggered at bar 0')
  
  triggered = false
  track({ bar: 1, beat: 0, tick: 0 })
  t.notOk(triggered, 'not triggered at bar 1')
  
  triggered = false
  track({ bar: 4, beat: 0, tick: 0 })
  t.ok(triggered, 'triggered at bar 4')
  
  t.end()
})

test('structure.loop - loops bar position', t => {
  let receivedBar = null
  
  const track = structure.loop(4, (state) => {
    receivedBar = state.bar
    return { actions: [] }
  })
  
  track({ bar: 0, beat: 0, tick: 0 })
  t.equals(receivedBar, 0, 'bar 0 maps to 0')
  
  track({ bar: 5, beat: 0, tick: 0 })
  t.equals(receivedBar, 1, 'bar 5 maps to 1')
  
  track({ bar: 8, beat: 0, tick: 0 })
  t.equals(receivedBar, 0, 'bar 8 maps to 0 (loops)')
  
  t.end()
})

test('structure.every - triggers every N bars', t => {
  let count = 0
  
  const track = structure.every(2, (state) => {
    count++
    return { actions: [] }
  })
  
  track({ bar: 0, beat: 0, tick: 0 })
  t.equals(count, 1, 'triggered at bar 0')
  
  track({ bar: 1, beat: 0, tick: 0 })
  t.equals(count, 1, 'not triggered at bar 1')
  
  track({ bar: 2, beat: 0, tick: 0 })
  t.equals(count, 2, 'triggered at bar 2')
  
  t.end()
})
