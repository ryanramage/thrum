const test = require('tape')
const { track, group, arrangement } = require('../lib/track')
const { State } = require('../lib/state')
const pattern = require('../lib/pattern')
const midi = require('../lib/midi')

test('track - creates a named track', t => {
  const t1 = track('kick', (state) => {
    return { actions: [{ note: 'C2' }] }
  })
  
  t.equal(t1.name, 'kick', 'track has name')
  t.ok(typeof t1.tick === 'function', 'track has tick method')
  t.end()
})

test('track - executes track function', t => {
  let executed = false
  
  const t1 = track('test', (state) => {
    executed = true
    return { actions: [] }
  })
  
  const state = State.from(0, 0, 0)
  t1.tick(state)
  
  t.ok(executed, 'track function was executed')
  t.end()
})

test('track - returns actions', t => {
  const t1 = track('test', (state) => {
    return { actions: [{ note: 'C4' }] }
  })
  
  const state = State.from(0, 0, 0)
  const result = t1.tick(state)
  
  t.ok(result.actions, 'has actions')
  t.equal(result.actions.length, 1, 'has one action')
  t.equal(result.actions[0].note, 'C4', 'action is correct')
  t.end()
})

test('track.mute - mutes track', t => {
  const t1 = track('test', (state) => {
    return { actions: [{ note: 'C4' }] }
  })
  
  t1.mute()
  
  const state = State.from(0, 0, 0)
  const result = t1.tick(state)
  
  t.equal(result.actions.length, 0, 'muted track returns no actions')
  t.end()
})

test('track.unmute - unmutes track', t => {
  const t1 = track('test', (state) => {
    return { actions: [{ note: 'C4' }] }
  })
  
  t1.mute()
  t1.unmute()
  
  const state = State.from(0, 0, 0)
  const result = t1.tick(state)
  
  t.equal(result.actions.length, 1, 'unmuted track returns actions')
  t.end()
})

test('track.toggleMute - toggles mute state', t => {
  const t1 = track('test', (state) => {
    return { actions: [{ note: 'C4' }] }
  })
  
  t.notOk(t1.muted, 'starts unmuted')
  
  t1.toggleMute()
  t.ok(t1.muted, 'is muted after toggle')
  
  t1.toggleMute()
  t.notOk(t1.muted, 'is unmuted after second toggle')
  
  t.end()
})

test('track.setChannel - overrides channel', t => {
  const t1 = track('test', (state) => {
    return { actions: [{ note: 'C4', channel: 0 }] }
  })
  
  t1.setChannel(5)
  
  const state = State.from(0, 0, 0)
  const result = t1.tick(state)
  
  t.equal(result.actions[0].channel, 5, 'channel is overridden')
  t.end()
})

test('track - works with pattern', t => {
  const t1 = track('kick', 
    pattern.pattern('x---').play(midi.note('C2'))
  )
  
  const state = State.from(0, 0, 0)
  const result = t1.tick(state)
  
  t.ok(result.actions.length > 0, 'pattern track generates actions')
  t.end()
})

test('group - creates a track group', t => {
  const t1 = track('kick', (state) => ({ actions: [{ note: 'C2' }] }))
  const t2 = track('snare', (state) => ({ actions: [{ note: 'D2' }] }))
  
  const g = group('drums', [t1, t2])
  
  t.equal(g.name, 'drums', 'group has name')
  t.ok(g.isGroup, 'is marked as group')
  t.equal(g.tracks.length, 2, 'has 2 tracks')
  t.end()
})

test('group - executes all tracks', t => {
  const t1 = track('kick', (state) => ({ actions: [{ note: 'C2' }] }))
  const t2 = track('snare', (state) => ({ actions: [{ note: 'D2' }] }))
  
  const g = group('drums', [t1, t2])
  
  const state = State.from(0, 0, 0)
  const result = g.tick(state)
  
  t.equal(result.actions.length, 2, 'has actions from both tracks')
  t.equal(result.actions[0].note, 'C2', 'first action is from kick')
  t.equal(result.actions[1].note, 'D2', 'second action is from snare')
  t.end()
})

test('group.mute - mutes entire group', t => {
  const t1 = track('kick', (state) => ({ actions: [{ note: 'C2' }] }))
  const t2 = track('snare', (state) => ({ actions: [{ note: 'D2' }] }))
  
  const g = group('drums', [t1, t2])
  g.mute()
  
  const state = State.from(0, 0, 0)
  const result = g.tick(state)
  
  t.equal(result.actions.length, 0, 'muted group returns no actions')
  t.end()
})

test('group.muteTrack - mutes individual track', t => {
  const t1 = track('kick', (state) => ({ actions: [{ note: 'C2' }] }))
  const t2 = track('snare', (state) => ({ actions: [{ note: 'D2' }] }))
  
  const g = group('drums', [t1, t2])
  g.muteTrack('kick')
  
  const state = State.from(0, 0, 0)
  const result = g.tick(state)
  
  t.equal(result.actions.length, 1, 'has one action')
  t.equal(result.actions[0].note, 'D2', 'only snare plays')
  t.end()
})

test('group.soloTrack - solos individual track', t => {
  const t1 = track('kick', (state) => ({ actions: [{ note: 'C2' }] }))
  const t2 = track('snare', (state) => ({ actions: [{ note: 'D2' }] }))
  const t3 = track('hihat', (state) => ({ actions: [{ note: 'F#2' }] }))
  
  const g = group('drums', [t1, t2, t3])
  g.soloTrack('snare')
  
  const state = State.from(0, 0, 0)
  const result = g.tick(state)
  
  t.equal(result.actions.length, 1, 'has one action')
  t.equal(result.actions[0].note, 'D2', 'only snare plays')
  t.end()
})

test('group.getTrack - retrieves track by name', t => {
  const t1 = track('kick', (state) => ({ actions: [] }))
  const t2 = track('snare', (state) => ({ actions: [] }))
  
  const g = group('drums', [t1, t2])
  
  const found = g.getTrack('snare')
  t.ok(found, 'track found')
  t.equal(found.name, 'snare', 'correct track returned')
  
  const notFound = g.getTrack('missing')
  t.notOk(notFound, 'missing track returns undefined')
  
  t.end()
})

test('arrangement - creates section-based arrangement', t => {
  const intro = (state) => ({ actions: [{ note: 'C4' }] })
  const verse = (state) => ({ actions: [{ note: 'D4' }] })
  const chorus = (state) => ({ actions: [{ note: 'E4' }] })
  
  const arr = arrangement([
    [2, 'intro', intro],
    [4, 'verse', verse],
    [4, 'chorus', chorus]
  ])
  
  // Bar 0 - intro
  let state = State.from(0, 0, 0)
  let result = arr(state)
  t.equal(result.actions[0].note, 'C4', 'bar 0 plays intro')
  
  // Bar 1 - still intro
  state = State.from(1, 0, 0)
  result = arr(state)
  t.equal(result.actions[0].note, 'C4', 'bar 1 plays intro')
  
  // Bar 2 - verse
  state = State.from(2, 0, 0)
  result = arr(state)
  t.equal(result.actions[0].note, 'D4', 'bar 2 plays verse')
  
  // Bar 6 - chorus
  state = State.from(6, 0, 0)
  result = arr(state)
  t.equal(result.actions[0].note, 'E4', 'bar 6 plays chorus')
  
  t.end()
})

test('arrangement - provides section info in state', t => {
  const verse = (state) => {
    t.equal(state.get('section'), 'verse', 'section name is in state')
    t.equal(state.get('sectionBar'), 1, 'section bar is correct')
    t.equal(state.get('absoluteBar'), 3, 'absolute bar is correct')
    return { actions: [] }
  }
  
  const arr = arrangement([
    [2, 'intro', (state) => ({ actions: [] })],
    [4, 'verse', verse]
  ])
  
  const state = State.from(3, 0, 0)
  arr(state)
  
  t.end()
})

test('arrangement - handles multiple tracks per section', t => {
  const t1 = (state) => ({ actions: [{ note: 'C4' }] })
  const t2 = (state) => ({ actions: [{ note: 'E4' }] })
  
  const arr = arrangement([
    [2, 'intro', [t1, t2]]
  ])
  
  const state = State.from(0, 0, 0)
  const result = arr(state)
  
  t.equal(result.actions.length, 2, 'has actions from both tracks')
  t.equal(result.actions[0].note, 'C4', 'first track action')
  t.equal(result.actions[1].note, 'E4', 'second track action')
  
  t.end()
})

test('arrangement - returns empty after all sections', t => {
  const intro = (state) => ({ actions: [{ note: 'C4' }] })
  
  const arr = arrangement([
    [2, 'intro', intro]
  ])
  
  // Bar 5 - past all sections
  const state = State.from(5, 0, 0)
  const result = arr(state)
  
  t.equal(result.actions.length, 0, 'returns no actions after sections end')
  t.end()
})
