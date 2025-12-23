# Thrum

A modern, functional music sequencer for live coding and algorithmic composition.

Thrum lets you create music with code using simple patterns, tracks, and arrangements. Perfect for live performance, studio production, and learning about music programming.

## What You'll Learn

This guide will teach you how to:
1. Set up Thrum and connect it to a synthesizer
2. Create your first drum pattern
3. Build a complete drum beat
4. Add melodies and chords
5. Control synthesizer parameters with CC automation
6. Structure a full composition with multiple sections

By the end, you'll be able to create complete pieces like the example songs included with Thrum.

## Installation

First, install Node.js if you haven't already (download from [nodejs.org](https://nodejs.org)).

Then install Thrum globally:

```bash
npm install -g thrum
```

## Setup: Connecting to a Synthesizer

Before we make music, we need to connect Thrum to something that makes sound.

### macOS Setup

1. **Create a virtual MIDI bus:**
   - Open "Audio MIDI Setup" (in Applications/Utilities)
   - Go to Window → Show MIDI Studio
   - Double-click "IAC Driver"
   - Check "Device is online"
   - You should see "IAC Driver Bus 1" in the list

2. **Connect a synthesizer:**
   
   You have several options:
   
   - **Web synth (easiest):** Open [Enfer](https://ryanramage.github.io/Enfer/) in your browser and select "IAC Driver Bus 1" as the MIDI input
   - **DAW:** Open Ableton, Logic, or Reaper and create a MIDI track with input from "IAC Driver Bus 1"
   - **Hardware synth:** Connect via a MIDI interface

### Windows/Linux Setup

On Windows and Linux, you'll need to set up a virtual MIDI port using software like loopMIDI (Windows) or similar tools. The process is similar - create a virtual port and connect your synthesizer to it.

## Your First Pattern: A Single Kick Drum

Let's start with the simplest possible pattern - a kick drum on beat 1.

Create a new folder for your project:

```bash
mkdir my-music
cd my-music
```

Create a file called `music.js`:

```javascript
const { pattern, midi, song } = require('thrum')

// A kick drum that plays on beat 1
const kick = pattern('x---').play(
  midi.note('C2', { channel: 9 })
)

// Create a song with just this one pattern
module.exports = song.create([kick], { tempo: 120 })
```

Let's break this down:

- `pattern('x---')` creates a rhythm where `x` means "play" and `-` means "rest"
- With 4 characters, each character represents one beat (quarter note)
- `midi.note('C2', { channel: 9 })` plays note C2 on MIDI channel 9 (the standard drum channel)
- `song.create([kick], { tempo: 120 })` creates a song at 120 BPM

Now create a `.thrumrc` file to configure MIDI:

```json
{
  "livecoding": true,
  "outputs": {
    "1": "IAC Driver Bus 1"
  }
}
```

Run it:

```bash
thrum music.js
```

You should hear a kick drum on beat 1 of every bar! Press Ctrl+C to stop.

## Adding More Drums

Let's add a snare on beats 2 and 4:

```javascript
const { pattern, midi, song } = require('thrum')

const kick = pattern('x---x---').play(
  midi.note('C2', { channel: 9 })
)

const snare = pattern('----x-------x---').play(
  midi.note('D2', { channel: 9 })
)

module.exports = song.create([kick, snare], { tempo: 120 })
```

Notice:
- The kick pattern now has 8 characters, so it plays on beats 1 and 3
- The snare pattern has 16 characters - this gives us 16th note resolution
- We pass both patterns to `song.create()` as an array

Save the file and Thrum will automatically reload with your changes!

## A Complete Drum Beat

Let's add hi-hats to complete our drum beat:

```javascript
const { pattern, midi, song } = require('thrum')

const kick = pattern('x---x---').play(
  midi.note('C2', { channel: 9 })
)

const snare = pattern('----x-------x---').play(
  midi.note('D2', { channel: 9 })
)

const hihat = pattern('x-x-x-x-x-x-x-x-').play(
  midi.note('F#2', { channel: 9, velocity: 80 })
)

module.exports = song.create([kick, snare, hihat], { tempo: 120 })
```

The hi-hat plays on every 8th note (every other 16th note) with a velocity of 80 (slightly quieter than the default 100).

## Using Named Tracks

As your music gets more complex, it helps to name your tracks:

```javascript
const { track, pattern, midi, song } = require('thrum')

const kick = track('kick',
  pattern('x---x---').play(midi.note('C2', { channel: 9 }))
)

const snare = track('snare',
  pattern('----x-------x---').play(midi.note('D2', { channel: 9 }))
)

const hihat = track('hihat',
  pattern('x-x-x-x-x-x-x-x-').play(midi.note('F#2', { channel: 9, velocity: 80 }))
)

module.exports = song.create([kick, snare, hihat], { tempo: 120 })
```

Named tracks let you mute, solo, and organize your music better.

## Adding a Bassline

Let's add a simple bassline. Change the MIDI channel to 0 (a melodic channel):

```javascript
const { track, pattern, midi, song } = require('thrum')

const kick = track('kick',
  pattern('x---x---').play(midi.note('C2', { channel: 9 }))
)

const snare = track('snare',
  pattern('----x-------x---').play(midi.note('D2', { channel: 9 }))
)

const hihat = track('hihat',
  pattern('x-x-x-x-x-x-x-x-').play(midi.note('F#2', { channel: 9, velocity: 80 }))
)

const bass = track('bass',
  pattern('x-x-x-x-').play(midi.note('C2', { channel: 0, length: 12 }))
)

module.exports = song.create([kick, snare, hihat, bass], { tempo: 120 })
```

The bass plays on every other 16th note on channel 0 (a melodic channel, not drums). The `length: 12` makes the notes shorter (12 ticks instead of the default 24).

## Playing Different Notes

Let's make the bassline more interesting by playing different notes:

```javascript
const bass = track('bass',
  pattern('x-x-x-x-x-x-x-x-').play((state) => {
    // Play different notes based on which beat we're on
    const notes = ['C2', 'C2', 'G1', 'C2', 'C2', 'G1', 'A#1', 'G1']
    const noteIndex = Math.floor((state.bar * 8 + state.beat * 2 + state.tick / 12) % 8)
    
    return midi.note(notes[noteIndex], { 
      channel: 0, 
      length: 12 
    })(state)
  })
)
```

Instead of always playing the same note, we use a function that:
- Takes the current `state` (which tells us where we are in the song)
- Picks a note from an array based on our position
- Returns the MIDI note to play

This is a powerful pattern - you can use any logic you want to decide what to play!

## Adding Chords

Let's add some chords using the `tonal` helper to make music theory easier:

```javascript
const { track, pattern, midi, song, tonal } = require('thrum')

// ... drum tracks ...

const bass = track('bass',
  pattern('x-x-x-x-x-x-x-x-').play((state) => {
    const notes = ['C2', 'C2', 'G1', 'C2', 'C2', 'G1', 'A#1', 'G1']
    const noteIndex = Math.floor((state.bar * 8 + state.beat * 2 + state.tick / 12) % 8)
    return midi.note(notes[noteIndex], { channel: 0, length: 12 })(state)
  })
)

const chords = track('chords',
  pattern('x-------x-------').play((state) => {
    // Play a C minor chord every 2 beats
    const chordNotes = tonal.chord('Cm', 4) // C minor in octave 4
    return midi.chord(chordNotes, {
      channel: 1,
      velocity: 60,
      length: 48,
      spread: 6 // Strum the chord with 6 ticks between notes
    })(state)
  })
)

module.exports = song.create([kick, snare, hihat, bass, chords], { tempo: 120 })
```

The `tonal.chord('Cm', 4)` helper gives us the MIDI note numbers for a C minor chord. The `midi.chord()` function plays all the notes, with a slight strum effect from `spread: 6`.

## Controlling Synthesizer Parameters

Most synthesizers respond to MIDI CC (Control Change) messages. Let's add a filter sweep:

```javascript
const { track, pattern, midi, song, tonal, ccRamp } = require('thrum')

// ... all previous tracks ...

const filterSweep = track('filter',
  ccRamp(74, 20, 100, 4, {
    channel: 1,
    resolution: 24,
    loop: true
  })
)

module.exports = song.create([
  kick, snare, hihat, bass, chords, filterSweep
], { tempo: 120 })
```

This creates a filter sweep that:
- Controls CC 74 (brightness/cutoff on many synths)
- Ramps from value 20 to 100
- Over 4 bars
- Updates every 24 ticks (every beat)
- Loops continuously

CC 74 is a standard MIDI CC for filter cutoff, but different synths use different CC numbers. Check your synth's documentation!

## Creating Sections

Real songs have structure - intro, verse, chorus, etc. Let's organize our music into sections:

```javascript
const { track, pattern, midi, song, tonal, ccRamp, arrangement } = require('thrum')

// INTRO: Just kick and hi-hat
const introKick = track('intro-kick',
  pattern('x-------').play(midi.note('C2', { channel: 9 }))
)

const introHihat = track('intro-hihat',
  pattern('x-x-x-x-').play(midi.note('F#2', { channel: 9, velocity: 60 }))
)

// VERSE: Full drums and bass
const verseKick = track('verse-kick',
  pattern('x---x---').play(midi.note('C2', { channel: 9 }))
)

const verseSnare = track('verse-snare',
  pattern('----x-------x---').play(midi.note('D2', { channel: 9 }))
)

const verseHihat = track('verse-hihat',
  pattern('x-x-x-x-x-x-x-x-').play(midi.note('F#2', { channel: 9, velocity: 80 }))
)

const verseBass = track('verse-bass',
  pattern('x-x-x-x-x-x-x-x-').play((state) => {
    const notes = ['C2', 'C2', 'G1', 'C2', 'C2', 'G1', 'A#1', 'G1']
    const noteIndex = Math.floor((state.bar * 8 + state.beat * 2 + state.tick / 12) % 8)
    return midi.note(notes[noteIndex], { channel: 0, length: 12 })(state)
  })
)

// CHORUS: Add chords
const chorusKick = track('chorus-kick',
  pattern('x---x---x---x---').play(midi.note('C2', { channel: 9 }))
)

const chorusSnare = track('chorus-snare',
  pattern('----x-------x---').play(midi.note('D2', { channel: 9 }))
)

const chorusHihat = track('chorus-hihat',
  pattern('xxxxxxxxxxxxxxxx').play(midi.note('F#2', { channel: 9, velocity: 90 }))
)

const chorusBass = track('chorus-bass',
  pattern('x-x-x-x-x-x-x-x-').play((state) => {
    const notes = ['C2', 'C2', 'G1', 'C2', 'C2', 'G1', 'A#1', 'G1']
    const noteIndex = Math.floor((state.bar * 8 + state.beat * 2 + state.tick / 12) % 8)
    return midi.note(notes[noteIndex], { channel: 0, length: 12 })(state)
  })
)

const chorusChords = track('chorus-chords',
  pattern('x-------x-------').play((state) => {
    const chordNotes = tonal.chord('Cm', 4)
    return midi.chord(chordNotes, {
      channel: 1,
      velocity: 70,
      length: 48,
      spread: 6
    })(state)
  })
)

// Create the arrangement
const composition = arrangement([
  [4, 'intro', [introKick, introHihat]],
  [8, 'verse', [verseKick, verseSnare, verseHihat, verseBass]],
  [8, 'chorus', [chorusKick, chorusSnare, chorusHihat, chorusBass, chorusChords]],
  [4, 'outro', [introKick, introHihat]]
])

module.exports = song.create([composition], { tempo: 120 })
```

Each section is defined as `[bars, name, tracks]`:
- `[4, 'intro', [introKick, introHihat]]` means "play these tracks for 4 bars"
- Sections play in order: intro → verse → chorus → outro

## Adding CC Automation Per Section

Let's add different filter sweeps for each section:

```javascript
const { track, pattern, midi, song, tonal, ccRamp, arrangement } = require('thrum')

// ... all the track definitions from above ...

// INTRO: Slow filter opening
const introFilter = track('intro-filter',
  ccRamp(74, 10, 40, 4, {
    channel: 1,
    resolution: 48,
    loop: false
  })
)

// VERSE: Subtle filter movement
const verseFilter = track('verse-filter',
  ccRamp(74, 40, 60, 8, {
    channel: 1,
    resolution: 24,
    loop: false
  })
)

// CHORUS: Bright and open
const chorusFilter = track('chorus-filter',
  ccRamp(74, 80, 100, 8, {
    channel: 1,
    resolution: 24,
    loop: false
  })
)

// OUTRO: Closing down
const outroFilter = track('outro-filter',
  ccRamp(74, 60, 20, 4, {
    channel: 1,
    resolution: 48,
    loop: false
  })
)

// Update the arrangement to include filters
const composition = arrangement([
  [4, 'intro', [introKick, introHihat, introFilter]],
  [8, 'verse', [verseKick, verseSnare, verseHihat, verseBass, verseFilter]],
  [8, 'chorus', [chorusKick, chorusSnare, chorusHihat, chorusBass, chorusChords, chorusFilter]],
  [4, 'outro', [introKick, introHihat, outroFilter]]
])

module.exports = song.create([composition], { tempo: 120 })
```

Now each section has its own filter automation that matches the energy of that section!

## Understanding CC Automation

Thrum provides several ways to automate CC parameters:

### ccRamp - Linear Sweep

```javascript
ccRamp(74, 20, 100, 4, {
  channel: 1,
  resolution: 24,
  loop: true
})
```

- Smoothly ramps from value 20 to 100
- Over 4 bars
- Updates every 24 ticks (every beat)
- Loops when it reaches the end

### ccLFO - Oscillating Movement

```javascript
const { ccLFO } = require('thrum')

const filterLFO = track('filter-lfo',
  ccLFO(74, 4, 30, {
    channel: 1,
    center: 64,
    resolution: 24,
    waveform: 'sine'
  })
)
```

- Oscillates CC 74 around center value 64
- Rate of 4 bars per cycle
- Depth of 30 (goes from 34 to 94)
- Sine wave shape (also: 'triangle', 'square', 'saw')

### ccCurve - Custom Shape

```javascript
const { ccCurve } = require('thrum')

const filterCurve = track('filter-curve',
  ccCurve(74, [20, 60, 80, 100, 80, 60, 40], 8, {
    channel: 1,
    resolution: 24,
    loop: true
  })
)
```

- Moves through specific values: 20 → 60 → 80 → 100 → 80 → 60 → 40
- Over 8 bars total
- Smoothly interpolates between values

## Common MIDI CC Numbers

Different synthesizers use different CC numbers, but these are common standards:

- **CC 1**: Modulation wheel
- **CC 7**: Volume
- **CC 10**: Pan
- **CC 11**: Expression
- **CC 16-19**: General purpose (often user-assignable)
- **CC 71**: Resonance/Harmonic Content
- **CC 74**: Brightness/Filter Cutoff
- **CC 91**: Reverb Depth
- **CC 93**: Chorus Depth

Always check your synthesizer's documentation to see which CC numbers it responds to!

## Testing Without MIDI Hardware

You can test your patterns without any MIDI hardware using the simulator:

```javascript
const { simulator } = require('thrum')
const mySong = require('./music.js')

const sim = simulator.create(mySong)

// Run for 4 bars and see what happens
const results = sim.run(4)
console.log(`Generated ${results.length} MIDI events`)

// Visualize the patterns
console.log(sim.visualize(4))
```

This will show you an ASCII visualization of your patterns, perfect for debugging!

## Example: Building a Complete Ambient Piece

Let's look at how the included `ambient-pad-demo.js` example is structured. This will show you how all these concepts come together.

The piece has four sections:

1. **Emergence (16 bars)**: Very slow fade-in with sparse chords
2. **Drift (32 bars)**: Slow evolution with subtle harmonic layers
3. **Expansion (32 bars)**: Richer harmonies and more movement
4. **Dissolution (32 bars)**: Slow fade to silence

Here's a simplified version showing the structure:

```javascript
const { song, track, pattern, midi, chordProgression, ccRamp, arrangement, tonal } = require('thrum')

// Helper to convert 0-1 range to MIDI CC 0-127
const toCC = (value) => Math.floor(value * 127)

// Define chord voicings
const chords = {
  Cmaj9: tonal.chord('Cmaj9', 3),
  Am11: tonal.chord('Am11', 3),
  Fmaj7: tonal.chord('Fmaj7', 3),
  Gsus2: tonal.chord('Gsus2', 3)
}

// SECTION 1: EMERGENCE
const emergenceChords = track('emergence-chords',
  chordProgression([chords.Cmaj9, chords.Am11, chords.Fmaj7, chords.Gsus2], {
    barsPerChord: 4,
    velocity: 40,
    length: 384, // Very long notes (4 bars)
    channel: 0,
    spread: 48 // Very slow strum
  })
)

const emergenceBrightness = track('emergence-brightness',
  ccRamp(74, toCC(0.1), toCC(0.35), 16, {
    channel: 0,
    resolution: 96, // Update every bar
    loop: false
  })
)

// SECTION 2: DRIFT
const driftChords = track('drift-chords',
  chordProgression([chords.Cmaj9, chords.Am11, chords.Fmaj7, chords.Gsus2], {
    barsPerChord: 4,
    velocity: 50,
    length: 384,
    channel: 0,
    spread: 36
  })
)

const driftBrightness = track('drift-brightness',
  ccLFO(74, 16, 25, {
    channel: 0,
    center: toCC(0.45),
    resolution: 96,
    waveform: 'sine'
  })
)

// Create the arrangement
const composition = arrangement([
  [16, 'emergence', [emergenceChords, emergenceBrightness]],
  [32, 'drift', [driftChords, driftBrightness]]
  // ... more sections ...
])

module.exports = song.create([composition], {
  tempo: 60, // Very slow for ambient
  meter: [4, 4]
})
```

Key techniques used:

- **Very long note lengths** (384 ticks = 4 bars) for sustained pads
- **Slow CC ramps** (16-32 bars) for gradual evolution
- **Low velocities** (40-60) for gentle, ambient sound
- **Wide chord spreads** (36-48 ticks) for harp-like strumming
- **Slow tempo** (60 BPM) for meditative feel

## Example: Building a Funky Bass Piece

The `funky-bass-demo.js` example shows a different approach - rhythmic, energetic, with lots of CC modulation:

```javascript
const { song, track, pattern, midi, bassline, ccLFO, ccRamp, arrangement, tonal } = require('thrum')

const toCC = (value) => Math.floor(value * 127)

// Funky bassline with accents
const funkBass = track('funk-bass',
  bassline(
    [tonal.midi('C2'), tonal.midi('C2'), tonal.midi('D#2'), tonal.midi('F2')],
    'x-x-x-xxx-x-x-x-',
    {
      velocity: 90,
      accentVelocity: 110,
      accentPattern: 'x-------x-------',
      length: 12,
      slideLength: 6,
      channel: 0
    }
  )
)

// Fast filter LFO for movement
const filterLFO = track('filter-lfo',
  ccLFO(74, 1, 40, {
    channel: 0,
    center: toCC(0.5),
    resolution: 6, // Very fast updates
    waveform: 'sine'
  })
)

// Resonance sweep
const resonanceSweep = track('resonance',
  ccRamp(71, toCC(0.2), toCC(0.7), 4, {
    channel: 0,
    resolution: 24,
    loop: true
  })
)

module.exports = song.create([
  funkBass,
  filterLFO,
  resonanceSweep
], {
  tempo: 110,
  meter: [4, 4]
})
```

Key techniques:

- **Short note lengths** (12 ticks) for punchy bass
- **Accent patterns** for groove and dynamics
- **Fast LFO** (1 bar cycle) for rhythmic filter movement
- **High velocities** (90-110) for aggressive sound
- **Fast CC updates** (resolution: 6) for detailed modulation

## Next Steps

Now you know the fundamentals! Here's what to explore next:

1. **Experiment with patterns**: Try different rhythm patterns, euclidean rhythms with `pattern.euclidean()`
2. **Learn music theory helpers**: Explore `tonal.scale()`, `tonal.chord()`, `tonal.voicing()`
3. **Study the examples**: Look at `piano-synth-demo.js` and `ambient-pad-demo.js` in the `examples/` folder
4. **Try different synths**: Each synth responds differently to CC messages - experiment!
5. **Create your own sections**: Build intro, verse, chorus, bridge sections
6. **Combine techniques**: Use LFOs, ramps, and curves together for complex modulation

## Quick Reference

### Pattern Notation
- `x` = play
- `-` = rest
- 4 characters = quarter note resolution
- 16 characters = 16th note resolution

### Common Functions
```javascript
// Patterns
pattern('x---x---').play(midiFunc)
pattern.euclidean(3, 8).play(midiFunc)

// MIDI
midi.note('C4', { velocity: 80, length: 24, channel: 0 })
midi.chord(['C4', 'E4', 'G4'], { spread: 6 })
midi.cc(74, 64, { channel: 0 })

// CC Automation
ccRamp(controller, startValue, endValue, bars, options)
ccLFO(controller, rate, depth, options)
ccCurve(controller, values, bars, options)

// Structure
track('name', trackFunc)
arrangement([[bars, 'name', tracks], ...])
song.create(tracks, { tempo: 120, meter: [4, 4] })

// Music Theory
tonal.chord('Cm', 4) // C minor chord in octave 4
tonal.scale('C major') // C major scale
tonal.midi('C4') // Convert note name to MIDI number
```

## Troubleshooting

**No sound?**
- Check that your MIDI connection is working (IAC Driver is online on macOS)
- Verify your `.thrumrc` has the correct output port name
- Make sure your synthesizer is listening to the right MIDI channel
- Try the web synth [Enfer](https://ryanramage.github.io/Enfer/) to test

**Changes not reloading?**
- Make sure `"livecoding": true` is in your `.thrumrc`
- Check the terminal for error messages
- Try stopping (Ctrl+C) and restarting Thrum

**Patterns not playing when expected?**
- Use `simulator.visualize()` to see what's happening
- Check that your pattern length matches your intention (4 chars vs 16 chars)
- Verify the MIDI channel matches your synth

## Community and Examples

- [GitHub Repository](https://github.com/ryanramage/thrum)
- [More Examples](https://github.com/ryanramage/thrum-examples)
- [Web Synth (Enfer)](https://ryanramage.github.io/Enfer/)

## License

MIT
