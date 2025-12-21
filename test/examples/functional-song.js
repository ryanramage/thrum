const test = require('tape')
const { bars, repeat, pattern, play, strum, transpose, chord, lfo, cc, Tonal, test: thrumTest, create } = require('../../index').meter(4, '4n')

test('functional song - verse with bass and chords', t => {
  // A funky verse with bass line and chord stabs
  const { actions } = thrumTest([
    // Bass line - funky 16th note pattern
    pattern('x--x--x-x---x-x-', play('C2')),
    
    // Chord stabs on first beat too
    pattern('x-------x-------', strum(chord('CM7').octave(4)))
  ])

  // testing
  t.ok(actions, 'actions exist')
  t.ok(actions.length > 0, 'has actions')
  
  // Check bass note on first beat
  let bassNote = actions.find(a => a.note === 'C2')
  t.ok(bassNote, 'bass note C2 is played')
  
  // Check chord is played
  let chordNote = actions.find(a => a.note && a.note.startsWith('C4'))
  t.ok(chordNote, 'chord note from C4 octave is played')
  
  t.end()
})

test('functional song - melodic sequence with transpose', t => {
  // Melodic pattern that gets transposed up a fifth
  const { actions } = thrumTest([
    repeat('8n', play('E4')),
    transpose('5P', repeat('8n', play('E4')))  // Same pattern, perfect fifth higher
  ])

  // testing
  t.ok(actions, 'actions exist')
  t.ok(actions.length > 0, 'has actions')
  
  let originalNote = actions.find(a => a.note === 'E4')
  t.ok(originalNote, 'original melody note E4 is played')
  
  // Check that we have at least 2 actions (original + transposed)
  t.ok(actions.length >= 2, 'has both original and transposed notes')
  
  // Check that there's a note that's not E4 (the transposed one)
  let transposedNote = actions.find(a => a.note && a.note !== 'E4')
  t.ok(transposedNote, 'transposed melody note is played')
  
  t.end()
})

test('functional song - drum pattern with multiple voices', t => {
  // Classic drum pattern
  const { actions } = thrumTest([
    // Kick on 1 and 3
    pattern('x---x---x---x---', play('C1')),
    
    // Snare on 2 and 4
    pattern('----x-------x---', play('D1')),
    
    // Hi-hat 8th notes
    pattern('x-x-x-x-x-x-x-x-', play('F#1'))
  ])

  // testing
  t.ok(actions, 'actions exist')
  t.ok(actions.length >= 2, 'has multiple drum hits on first beat')
  
  let kick = actions.find(a => a.note === 'C1')
  t.ok(kick, 'kick drum C1 is played')
  
  let hihat = actions.find(a => a.note === 'F#1')
  t.ok(hihat, 'hi-hat F#1 is played')
  
  t.end()
})

test('functional song - chord progression with rhythm', t => {
  // Rhythmic strumming pattern
  const { actions } = thrumTest([
    pattern('x---x-x---x-x---', strum(chord('CM').octave(4)))
  ])

  // testing
  t.ok(actions, 'actions exist')
  t.ok(actions.length > 0, 'chord notes are played')
  
  // Check that multiple notes from the chord are present
  let cNote = actions.find(a => a.note && a.note.startsWith('C'))
  let eNote = actions.find(a => a.note && a.note.startsWith('E'))
  let gNote = actions.find(a => a.note && a.note.startsWith('G'))
  
  t.ok(cNote, 'C note from chord is played')
  t.ok(eNote, 'E note from chord is played')
  t.ok(gNote, 'G note from chord is played')
  
  t.end()
})

test('functional song - arpeggio with repeat', t => {
  // Arpeggiated chord using repeat and a note function
  const cmChord = chord('CM')
  const arpeggio = i => {
    const notes = cmChord.chord.notes
    return notes[i % notes.length] + '4'
  }
  
  const { actions } = thrumTest([
    repeat('16n', play(arpeggio))
  ])

  // testing
  t.ok(actions, 'actions exist')
  t.ok(actions.length > 0, 'arpeggio notes are played')
  
  let note = actions[0]
  t.ok(['C4', 'E4', 'G4'].includes(note.note), 'first note is from C major chord')
  
  t.end()
})

test('functional song - complete 4-bar phrase', t => {
  // A complete musical phrase combining multiple elements
  const { actions } = thrumTest([
    // Bass line
    pattern('x-------x-------', play('C2')),
    
    // Chord progression
    pattern('x-------x-------', strum(chord('CM7').octave(3))),
    
    // Melody
    pattern('x-x---x---x-x---', play('E5')),
    
    // Percussion
    pattern('x-x-x-x-x-x-x-x-', play('F#1'))
  ])

  // testing
  t.ok(actions, 'actions exist')
  t.ok(actions.length >= 2, 'multiple instruments playing')
  
  // Verify we have notes from different octaves (different instruments)
  let bass = actions.find(a => a.note === 'C2')
  let perc = actions.find(a => a.note === 'F#1')
  
  t.ok(bass, 'bass is present')
  t.ok(perc, 'percussion is present')
  
  t.end()
})

test('functional song - lfo modulating filter cutoff', t => {
  // Synth pad with LFO modulating filter
  const { actions } = thrumTest([
    // Sustained chord
    repeat('1m', strum({spread: 0}, chord('Am7').octave(3))),
    
    // LFO controlling filter cutoff (CC 74)
    lfo('4m', '16n', 'sine', 20, 127, cc(74))
  ])

  // testing
  t.ok(actions, 'actions exist')
  
  // Check for chord notes
  let chordNotes = actions.filter(a => a.note)
  t.ok(chordNotes.length > 0, 'chord notes are present')
  
  // Check for CC message
  let ccMessage = actions.find(a => a.to === 'toCC')
  t.ok(ccMessage, 'CC message for LFO is present')
  t.equals(ccMessage.knob, 74, 'CC 74 (filter cutoff) is being modulated')
  
  t.end()
})

test('functional song - using create() for stateful song', t => {
  const song = create()
  
  // First tick at spp 0
  let result = song.tick([
    repeat('4n', play('C4'))
  ])
  
  t.ok(result.actions.length > 0, 'first tick has actions')
  t.equals(result.spp, 0, 'spp is 0')
  
  // Advance time
  song.advance(24) // advance by one 16th note
  
  // Second tick at spp 24
  result = song.tick([
    repeat('4n', play('C4'))
  ])
  
  t.equals(result.spp, 24, 'spp advanced to 24')
  
  // Reset
  song.reset()
  result = song.tick([
    repeat('4n', play('C4'))
  ])
  
  t.equals(result.spp, 0, 'spp reset to 0')
  
  t.end()
})
