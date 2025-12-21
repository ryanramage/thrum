const test = require('tape')
const { bars, repeat, pattern, play, strum, transpose, chord, lfo, cc, Tonal } = require('../../index').meter(4, '4n')
const SongState = require('../../r/songState')
const _tick = require('../../r/tick')

test('functional song - verse with bass and chords', t => {
  // setup
  let result = null
  let tick = exp => result = _tick(exp, SongState.set({spp: 0, userState: {}, actions: []}))

  // A funky verse with bass line and chord stabs
  tick([
    // Bass line - funky 16th note pattern
    pattern('x--x--x-x---x-x-', play('C2')),
    
    // Chord stabs on beats 2 and 4
    pattern('----x-------x---', strum(chord('CM7').octave(4)))
  ])

  // testing
  t.ok(result, 'result exists')
  t.ok(result.actions.length > 0, 'has actions')
  
  // Check bass note on first beat
  let bassNote = result.actions.find(a => a.note === 'C2')
  t.ok(bassNote, 'bass note C2 is played')
  
  // Check chord is played
  let chordNote = result.actions.find(a => a.note && a.note.startsWith('C4'))
  t.ok(chordNote, 'chord note from C4 octave is played')
  
  t.end()
})

test('functional song - melodic sequence with transpose', t => {
  // setup
  let result = null
  let tick = exp => result = _tick(exp, SongState.set({spp: 0, userState: {}, actions: []}))

  // Melodic pattern that gets transposed up a fifth
  tick([
    pattern('x-x-x-x-', play('E4')),
    transpose('5P', pattern('x-x-x-x-', play('E4')))  // Same pattern, perfect fifth higher
  ])

  // testing
  t.ok(result, 'result exists')
  
  let originalNote = result.actions.find(a => a.note === 'E4')
  t.ok(originalNote, 'original melody note E4 is played')
  
  let transposedNote = result.actions.find(a => a.note === 'B4')
  t.ok(transposedNote, 'transposed melody note B4 is played')
  
  t.end()
})

test('functional song - drum pattern with multiple voices', t => {
  // setup
  let result = null
  let tick = exp => result = _tick(exp, SongState.set({spp: 0, userState: {}, actions: []}))

  // Classic drum pattern
  tick([
    // Kick on 1 and 3
    pattern('x---x---x---x---', play('C1')),
    
    // Snare on 2 and 4
    pattern('----x-------x---', play('D1')),
    
    // Hi-hat 8th notes
    pattern('x-x-x-x-x-x-x-x-', play('F#1'))
  ])

  // testing
  t.ok(result, 'result exists')
  t.ok(result.actions.length >= 2, 'has multiple drum hits on first beat')
  
  let kick = result.actions.find(a => a.note === 'C1')
  t.ok(kick, 'kick drum C1 is played')
  
  let hihat = result.actions.find(a => a.note === 'F#1')
  t.ok(hihat, 'hi-hat F#1 is played')
  
  t.end()
})

test('functional song - chord progression with rhythm', t => {
  // setup
  let result = null
  let tick = exp => result = _tick(exp, SongState.set({spp: 0, userState: {}, actions: []}))

  // Rhythmic strumming pattern
  tick([
    pattern('x---x-x---x-x---', strum(chord('CM').octave(4)))
  ])

  // testing
  t.ok(result, 'result exists')
  t.ok(result.actions.length > 0, 'chord notes are played')
  
  // Check that multiple notes from the chord are present
  let cNote = result.actions.find(a => a.note && a.note.startsWith('C'))
  let eNote = result.actions.find(a => a.note && a.note.startsWith('E'))
  let gNote = result.actions.find(a => a.note && a.note.startsWith('G'))
  
  t.ok(cNote, 'C note from chord is played')
  t.ok(eNote, 'E note from chord is played')
  t.ok(gNote, 'G note from chord is played')
  
  t.end()
})

test('functional song - arpeggio with repeat', t => {
  // setup
  let result = null
  let tick = exp => result = _tick(exp, SongState.set({spp: 0, userState: {}, actions: []}))

  // Arpeggiated chord using repeat and a note function
  const cmChord = chord('CM')
  const arpeggio = i => {
    const notes = cmChord.chord.notes
    return notes[i % notes.length] + '4'
  }
  
  tick([
    repeat('16n', play(arpeggio))
  ])

  // testing
  t.ok(result, 'result exists')
  t.ok(result.actions.length > 0, 'arpeggio notes are played')
  
  let note = result.actions[0]
  t.ok(['C4', 'E4', 'G4'].includes(note.note), 'first note is from C major chord')
  
  t.end()
})

test('functional song - complete 4-bar phrase', t => {
  // setup
  let result = null
  let tick = exp => result = _tick(exp, SongState.set({spp: 0, userState: {}, actions: []}))

  // A complete musical phrase combining multiple elements
  tick([
    // Bass line
    pattern('x-------x-------', play('C2')),
    
    // Chord progression
    pattern('----x-------x---', strum(chord('CM7').octave(3))),
    
    // Melody
    pattern('--x---x---x-x---', play('E5')),
    
    // Percussion
    pattern('x-x-x-x-x-x-x-x-', play('F#1'))
  ])

  // testing
  t.ok(result, 'result exists')
  t.ok(result.actions.length >= 2, 'multiple instruments playing')
  
  // Verify we have notes from different octaves (different instruments)
  let bass = result.actions.find(a => a.note === 'C2')
  let perc = result.actions.find(a => a.note === 'F#1')
  
  t.ok(bass, 'bass is present')
  t.ok(perc, 'percussion is present')
  
  t.end()
})

test('functional song - lfo modulating filter cutoff', t => {
  // setup
  let result = null
  let tick = exp => result = _tick(exp, SongState.set({spp: 0, userState: {}, actions: []}))

  // Synth pad with LFO modulating filter
  tick([
    // Sustained chord
    repeat('1m', strum({spread: 0}, chord('Am7').octave(3))),
    
    // LFO controlling filter cutoff (CC 74)
    lfo('4m', '16n', 'sine', 20, 127, cc(74))
  ])

  // testing
  t.ok(result, 'result exists')
  
  // Check for chord notes
  let chordNotes = result.actions.filter(a => a.note)
  t.ok(chordNotes.length > 0, 'chord notes are present')
  
  // Check for CC message
  let ccMessage = result.actions.find(a => a.to === 'toCC')
  t.ok(ccMessage, 'CC message for LFO is present')
  t.equals(ccMessage.knob, 74, 'CC 74 (filter cutoff) is being modulated')
  
  t.end()
})
