const test = require('tape')
const thrum = require('../index').meter(4, '4n')

test('shortcuts - kick with default pattern', t => {
  const result = thrum.test([
    thrum.kick()
  ])
  
  console.log('result:', result)
  console.log('actions:', result.actions)
  console.log('actions length:', result.actions ? result.actions.length : 'undefined')
  
  t.ok(result.actions, 'actions exist')
  t.ok(result.actions.length > 0, 'kick produces actions')
  if (result.actions && result.actions.length > 0) {
    t.equals(result.actions[0].note, 'C1', 'kick uses C1 note')
  } else {
    t.fail('no actions produced')
  }
  
  t.end()
})

test('shortcuts - kick with custom pattern', t => {
  const { actions } = thrum.test([
    thrum.kick('x-x-x-x-')
  ])
  
  t.ok(actions.length > 0, 'custom kick pattern produces actions')
  if (actions.length > 0) {
    t.equals(actions[0].note, 'C1', 'kick uses C1 note')
  }
  
  t.end()
})

test('shortcuts - snare with default pattern', t => {
  const { actions } = thrum.test([
    thrum.snare()
  ])
  
  t.ok(actions.length === 0, 'snare on beat 2 does not fire at spp 0')
  
  const { actions: actions2 } = thrum.test([
    thrum.snare()
  ], { spp: 96 })
  
  t.ok(actions2.length > 0, 'snare fires at spp 96 (beat 2)')
  if (actions2.length > 0) {
    t.equals(actions2[0].note, 'D1', 'snare uses D1 note')
  }
  
  t.end()
})

test('shortcuts - hihat with default pattern', t => {
  const { actions } = thrum.test([
    thrum.hihat()
  ])
  
  t.ok(actions.length > 0, 'hihat produces actions')
  if (actions.length > 0) {
    t.equals(actions[0].note, 'F#1', 'hihat uses F#1 note')
  }
  
  t.end()
})

test('shortcuts - fourOnFloor preset', t => {
  const { actions } = thrum.test([
    ...thrum.fourOnFloor()
  ])
  
  t.ok(actions.length >= 2, 'fourOnFloor produces multiple drum hits')
  
  const kick = actions.find(a => a.note === 'C1')
  const hihat = actions.find(a => a.note === 'F#1')
  
  t.ok(kick, 'fourOnFloor includes kick')
  t.ok(hihat, 'fourOnFloor includes hihat')
  
  t.end()
})

test('shortcuts - breakbeat preset', t => {
  const { actions } = thrum.test([
    ...thrum.breakbeat()
  ])
  
  t.ok(actions.length >= 2, 'breakbeat produces multiple drum hits')
  
  const kick = actions.find(a => a.note === 'C1')
  const hihat = actions.find(a => a.note === 'F#1')
  
  t.ok(kick, 'breakbeat includes kick')
  t.ok(hihat, 'break beat includes hihat')
  
  t.end()
})

test('defaults - play with default length and velocity', t => {
  const { actions } = thrum.test([
    thrum.repeat('4n', thrum.play('C4'))
  ])
  
  t.ok(actions.length > 0, 'play produces actions')
  t.equals(actions[0].note, 'C4', 'correct note')
  t.equals(actions[0].length, 96, 'default length is quarter note (96 ticks)')
  t.equals(actions[0].velocity, 100, 'default velocity is 100')
  
  t.end()
})

test('defaults - strum with chord name shorthand', t => {
  const { actions } = thrum.test([
    thrum.repeat('4n', thrum.strum('CM'))
  ])
  
  t.ok(actions.length > 0, 'strum with chord name produces actions')
  
  const cNote = actions.find(a => a.note && a.note.startsWith('C'))
  const eNote = actions.find(a => a.note && a.note.startsWith('E'))
  
  t.ok(cNote, 'C note from chord is present')
  t.ok(eNote, 'E note from chord is present')
  
  t.end()
})

test('defaults - strum with chord name and custom octave', t => {
  const { actions } = thrum.test([
    thrum.repeat('4n', thrum.strum({octave: 5}, 'CM'))
  ])
  
  t.ok(actions.length > 0, 'strum with custom octave produces actions')
  
  const cNote = actions.find(a => a.note && a.note.startsWith('C5'))
  t.ok(cNote, 'C5 note from chord is present')
  
  t.end()
})

test('natural language - beat', t => {
  const { actions } = thrum.test([
    thrum.repeat('beat', thrum.play('C4'))
  ])
  
  t.ok(actions.length > 0, 'repeat with "beat" works')
  
  t.end()
})

test('natural language - bar', t => {
  const { actions } = thrum.test([
    thrum.repeat('bar', thrum.play('C4'))
  ])
  
  t.ok(actions.length > 0, 'repeat with "bar" works')
  
  t.end()
})

test('natural language - 2 bars', t => {
  const { actions } = thrum.test([
    thrum.repeat('2 bars', thrum.play('C4'))
  ])
  
  t.ok(actions.length > 0, 'repeat with "2 bars" works')
  
  t.end()
})

test('natural language - 4 beats', t => {
  const { actions } = thrum.test([
    thrum.repeat('4 beats', thrum.play('C4'))
  ])
  
  t.ok(actions.length > 0, 'repeat with "4 beats" works')
  
  t.end()
})

test('natural language - quarter', t => {
  const { actions } = thrum.test([
    thrum.repeat('quarter', thrum.play('C4'))
  ])
  
  t.ok(actions.length > 0, 'repeat with "quarter" works')
  
  t.end()
})

test('natural language - eighth', t => {
  const { actions } = thrum.test([
    thrum.repeat('eighth', thrum.play('C4'))
  ])
  
  t.ok(actions.length > 0, 'repeat with "eighth" works')
  
  t.end()
})
