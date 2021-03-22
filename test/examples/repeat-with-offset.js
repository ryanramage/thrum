const test = require('tape')
const _tick = require('../../r/tick.js')
const SongState = require('../../r/songState.js')
const {chord, repeat, play} = require('../../index.js').meter([4, '4n'])

test('repeat with offset 1 wont play on spp 0', t => {
  // setup
  let result = null
  let tick = exp => result = _tick(exp, SongState.set({spp: 0, userState: {}, actions: []}))

  // raw user section
  let am = chord('Am')
  tick([
    repeat({period: '4n', offset: 1}, play(am))
  ])

  // testing
  t.ok(result)
  t.equals(result.actions.length, 0)
  t.end()
})

test('repeat with offset 1 will play on spp 1', t => {
  // setup
  let result = null
  let tick = exp => result = _tick(exp, SongState.set({spp: 1, userState: {}, actions: []}))

  // raw user section
  let am = chord('Am')
  tick([
    repeat({period: '4n', offset: 1}, play(am))
  ])

  // testing
  t.ok(result)
  t.equals(result.actions[0].note, 'A4')
  t.equals(result.actions[0].length, 24)
  t.end()
})
