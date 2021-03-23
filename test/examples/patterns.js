const test = require('tape')
const _tick = require('../../r/tick.js')
const SongState = require('../../r/songState.js')
const {chord, pattern, play} = require('../../index.js').meter([4, '4n'])

test('pattern play a quarter note on the first beat', t => {
  // setup
  let result = null
  let tick = exp => result = _tick(exp, SongState.set({spp: 0, userState: {}, actions: []}))

  // raw user section
  tick([
    pattern('x---', play('C4'))
  ])

  // testing
  t.ok(result)
  t.equals(result.actions[0].note, 'C4')
  t.equals(result.actions[0].length, 24)
  t.end()
})

test('a beat that does not play, (and tick with just an expression)', t => {
  // setup
  let result = null
  let tick = exp => result = _tick(exp, SongState.set({spp: 0, userState: {}, actions: []}))

  // raw user section
  tick(pattern('---x', play('C4')))

  // testing
  t.ok(result)
  t.equals(result.actions.length, 0)
  t.end()
})

test('pattern play a half note on the first beat', t => {
  // setup
  let result = null
  let tick = exp => result = _tick(exp, SongState.set({spp: 0, userState: {}, actions: []}))

  // raw user section
  tick([
    pattern('x_--', play('C4'))
  ])

  // testing
  t.ok(result)
  t.equals(result.actions[0].note, 'C4')
  t.equals(result.actions[0].length, 48)
  t.end()
})

test('split using the [] syntax, plays a 16th note on first beat', t => {
  // setup
  let result = null
  let tick = exp => result = _tick(exp, SongState.set({spp: 0, userState: {}, actions: []}))

  // raw user section
  tick([
    pattern('[x-x-]---', play('C4'))
  ])

  // testing
  t.ok(result)
  t.equals(result.actions[0].note, 'C4')
  t.equals(result.actions[0].length, 6)
  t.end()
})

test('split using the [] syntax, plays a 16th note on 3rd beat', t => {
  // setup
  let result = null
  let tick = exp => result = _tick(exp, SongState.set({spp: 12, userState: {}, actions: []}))

  // raw user section
  tick([
    pattern('[x-x-]---', play('C4'))
  ])

  // testing
  t.ok(result)
  t.equals(result.actions[0].note, 'C4')
  t.equals(result.actions[0].length, 6)
  t.end()
})
