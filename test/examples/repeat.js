const test = require('tape')
const _tick = require('../../r/tick.js')
const SongState = require('../../r/songState.js')
const {chord, repeat, play} = require('../../index.js').meter(4, '4n')

test('on repeat first tick will play an A4', t => {
  // setup
  let result = null
  let tick = exp => result = _tick(exp, SongState.set({spp: 0, userState: {}, actions: []}))

  // raw user section
  let am = chord('Am')
  tick(repeat('4n', play(am)))

  // testing
  t.ok(result)
  t.equals(result.actions[0].note, 'A4')
  t.equals(result.actions[0].length, 24)
  t.end()
})

test('on repeat first tick will play an A4, alternate config of repeat', t => {
  // setup
  let result = null
  let tick = exp => result = _tick(exp, SongState.set({spp: 0, userState: {}, actions: []}))

  // raw user section
  let am = chord('Am')
  tick([
    repeat({period: '4n'}, play(am))
  ])

  // testing
  t.ok(result)
  t.equals(result.actions[0].note, 'A4')
  t.equals(result.actions[0].length, 24)
  t.end()
})


test('spp 1 will nothing', t => {
  // setup
  let result = null
  let tick = exp => result = _tick(exp, SongState.set({spp: 1, userState: {}, actions: []}))

  // raw user section
  let am = chord('Am')
  tick([
    repeat('4n', play(am))
  ])

  // testing
  t.ok(result)
  t.equals(result.actions.length, 0)
  t.end()
})

test('on repeat 24 tick will play an C4', t => {
  // setup
  let result = null
  let tick = exp => result = _tick(exp, SongState.set({spp: 24, userState: {}, actions: []}))

  // raw user section
  let am = chord('Am')
  tick([
    repeat('4n', play(am))
  ])

  // testing
  t.ok(result)
  t.equals(result.actions[0].note, 'C4')
  t.equals(result.actions[0].length, 24)
  t.end()
})

test('on repeat 48 tick will play an E4', t => {
  // setup
  let result = null
  let tick = exp => result = _tick(exp, SongState.set({spp: 48, userState: {}, actions: []}))

  // raw user section
  let am = chord('Am')
  tick([
    repeat('4n', play(am))
  ])

  // testing
  t.ok(result)
  t.equals(result.actions[0].note, 'E4')
  t.equals(result.actions[0].length, 24)
  t.end()
})

test('on repeat 72 tick will play an A4 again', t => {
  // setup
  let result = null
  let tick = exp => result = _tick(exp, SongState.set({spp: 72, userState: {}, actions: []}))

  // raw user section
  let am = chord('Am')
  tick([
    repeat('4n', play(am))
  ])

  // testing
  t.ok(result)
  t.equals(result.actions[0].note, 'A4')
  t.equals(result.actions[0].length, 24)
  t.end()
})
