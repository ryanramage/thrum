const test = require('tape')
const song = require('../lib-next/song.js')

test('song.create - creates a song with tracks', t => {
  const s = song.create([])
  
  t.ok(s, 'song created')
  t.ok(s.tick, 'song has tick method')
  t.ok(Array.isArray(s.tracks), 'song has tracks array')
  
  t.end()
})

test('song.create - executes tracks on tick', t => {
  let executed = false
  
  const track = (state) => {
    executed = true
    return { actions: [] }
  }
  
  const s = song.create([track])
  const state = { bar: 0, beat: 0, tick: 0 }
  
  s.tick(state)
  
  t.ok(executed, 'track was executed')
  t.end()
})

test('song.create - collects actions from tracks', t => {
  const track1 = (state) => ({ actions: [{ note: 'C4' }] })
  const track2 = (state) => ({ actions: [{ note: 'E4' }] })
  
  const s = song.create([track1, track2])
  const state = { bar: 0, beat: 0, tick: 0 }
  
  const result = s.tick(state)
  
  t.equals(result.actions.length, 2, 'collected actions from both tracks')
  t.equals(result.actions[0].note, 'C4', 'first action correct')
  t.equals(result.actions[1].note, 'E4', 'second action correct')
  
  t.end()
})

test('song.create - accepts meter option', t => {
  const s = song.create([], { meter: [3, 4] })
  
  t.deepEquals(s.meter, [3, 4], 'meter set correctly')
  t.end()
})

test('song.create - defaults to 4/4 meter', t => {
  const s = song.create([])
  
  t.deepEquals(s.meter, [4, 4], 'defaults to 4/4')
  t.end()
})

test('song.section - generates different content per section', t => {
  let receivedBar = null
  
  const track = song.section(4, (bar, state) => {
    receivedBar = bar
    return { actions: [] }
  })
  
  track({ bar: 0, beat: 0, tick: 0 })
  t.equals(receivedBar, 0, 'section 0 at bar 0')
  
  track({ bar: 4, beat: 0, tick: 0 })
  t.equals(receivedBar, 1, 'section 1 at bar 4')
  
  track({ bar: 8, beat: 0, tick: 0 })
  t.equals(receivedBar, 2, 'section 2 at bar 8')
  
  t.end()
})
