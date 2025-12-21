const test = require('tape')
const { kick, snare, hihat, fourOnFloor, breakbeat, repeat, play, strum, test: thrumTest } = require('../../index').meter(4, '4n')

test('demo - simple drum pattern with shortcuts', t => {
  const { actions } = thrumTest([
    kick(),
    snare(),
    hihat()
  ])
  
  t.ok(actions.length >= 2, 'drum pattern produces actions')
  t.comment('Kick, snare, and hihat with default patterns')
  
  t.end()
})

test('demo - custom drum patterns', t => {
  const { actions } = thrumTest([
    kick('x-x-x-x-'),      // syncopated kick
    snare('----x---'),     // snare on 2
    hihat('x-x-x-x-x-x-')  // custom hihat pattern
  ])
  
  t.ok(actions.length >= 2, 'custom drum patterns produce actions')
  t.comment('Custom patterns for each drum')
  
  t.end()
})

test('demo - preset drum kits', t => {
  const { actions } = thrumTest([
    ...fourOnFloor()
  ])
  
  t.ok(actions.length >= 2, 'fourOnFloor preset works')
  t.comment('Four on the floor house beat')
  
  t.end()
})

test('demo - natural language timing', t => {
  const { actions } = thrumTest([
    repeat('beat', play('C4')),
    repeat('2 bars', play('E4')),
    repeat('quarter', play('G4'))
  ])
  
  t.ok(actions.length >= 3, 'natural language timing works')
  t.comment('Using "beat", "2 bars", and "quarter" for timing')
  
  t.end()
})

test('demo - chord shorthand', t => {
  const { actions } = thrumTest([
    repeat('bar', strum('CM7')),
    repeat('bar', strum({octave: 5}, 'Dm7'))
  ])
  
  t.ok(actions.length > 0, 'chord shorthand works')
  t.comment('Using chord names directly in strum()')
  
  t.end()
})

test('demo - complete song with shortcuts', t => {
  const { actions } = thrumTest([
    // Drums
    ...fourOnFloor(),
    
    // Bass
    repeat('bar', play('C2')),
    
    // Chords
    repeat('2 bars', strum('CM7'))
  ])
  
  t.ok(actions.length >= 3, 'complete song with shortcuts')
  t.comment('Full arrangement using shortcuts and natural language')
  
  t.end()
})
