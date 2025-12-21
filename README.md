# Thrum

A modern, functional music sequencer for live coding and algorithmic composition.

Thrum provides a clean, composable API for creating MIDI sequences using patterns, tracks, and arrangements. Built with functional programming principles, it's designed for both live performance and studio production.

## Features

- **Pattern-based sequencing** - Create rhythms with simple string notation
- **Named tracks** - Organize your music with labeled tracks and groups
- **Arrangements** - Structure songs with intro, verse, chorus sections
- **Immutable state** - Predictable, testable music generation
- **Simulator** - Test and visualize patterns without MIDI hardware
- **Live coding friendly** - Hot reload your music as you code

## Installation

```bash
npm install thrum
```

Or install globally for the CLI:

```bash
npm install -g thrum
```

## Quick Start

### Basic Pattern

Create a simple kick drum pattern:

```javascript
const { pattern, midi, song, simulator } = require('thrum/lib-next')

// Create a pattern that plays on beats 1 and 3
const kick = pattern.pattern('x---x---').play(
  midi.note('C2', { channel: 9 })
)

// Create a song with the pattern
const mySong = song.create([kick], { tempo: 120 })

// Simulate it (no MIDI hardware needed)
const sim = simulator.create(mySong)
const results = sim.run(4) // Run for 4 bars

console.log(`Generated ${results.length} events`)
console.log(sim.visualize(4)) // ASCII visualization
```

### Multiple Tracks

Build a drum beat with multiple patterns:

```javascript
const { pattern, midi, song, simulator } = require('thrum/lib-next')

// Kick on 1 and 3
const kick = pattern.pattern('x---x---').play(
  midi.note('C2', { channel: 9 })
)

// Snare on 2 and 4
const snare = pattern.pattern('----x-------x---').play(
  midi.note('D2', { channel: 9 })
)

// Hi-hat on every 8th note
const hihat = pattern.pattern('x-x-x-x-x-x-x-x-').play(
  midi.note('F#2', { channel: 9, velocity: 80 })
)

const mySong = song.create([kick, snare, hihat], { tempo: 120 })
const sim = simulator.create(mySong)

console.log(sim.visualize(4))
```

## Core Concepts

### Patterns

Patterns define when notes play using a simple string notation:

- `x` = play a note
- `-` = rest (silence)

```javascript
const { pattern, midi } = require('thrum/lib-next')

// Quarter notes on beats 1 and 3
pattern.pattern('x---x---').play(midi.note('C4'))

// 16th note hi-hats
pattern.pattern('x-x-x-x-x-x-x-x-').play(midi.note('F#2'))

// Euclidean rhythm: 3 hits distributed over 8 steps
pattern.euclidean(3, 8).play(midi.note('C4'))
```

**Pattern Resolution:**
- 4 characters = quarter note resolution (24 ticks per character)
- 16 characters = 16th note resolution (6 ticks per character)

### MIDI Functions

MIDI functions define what happens when a pattern triggers:

```javascript
const { midi } = require('thrum/lib-next')

// Single note
midi.note('C4')
midi.note('C4', { velocity: 80, length: 12, channel: 0 })

// Chord (multiple notes at once)
midi.chord(['C4', 'E4', 'G4'])
midi.chord(['C4', 'E4', 'G4'], { spread: 3 }) // Strum with 3 tick delay

// Control Change
midi.cc(16, 64) // Controller 16, value 64
midi.cc(16, 64, { channel: 1 })
```

### Named Tracks

Organize your music with named tracks:

```javascript
const { track, pattern, midi } = require('thrum/lib-next')

const kick = track('kick',
  pattern.pattern('x---x---').play(midi.note('C2'))
)

const snare = track('snare',
  pattern.pattern('----x---').play(midi.note('D2'))
)

// Mute/unmute tracks
kick.mute()
kick.unmute()
kick.toggleMute()

// Override MIDI channel
kick.setChannel(9)
```

### Track Groups

Group related tracks together:

```javascript
const { track, group, pattern, midi } = require('thrum/lib-next')

const kick = track('kick', pattern.pattern('x---').play(midi.note('C2')))
const snare = track('snare', pattern.pattern('----x---').play(midi.note('D2')))
const hihat = track('hihat', pattern.pattern('x-x-x-x-').play(midi.note('F#2')))

const drums = group('drums', [kick, snare, hihat])

// Control the entire group
drums.mute()
drums.unmute()

// Control individual tracks
drums.muteTrack('hihat')
drums.soloTrack('kick')
drums.unsoloAll()
```

### Arrangements

Structure your song with sections:

```javascript
const { arrangement, track, pattern, midi } = require('thrum/lib-next')

// Define tracks for each section
const introKick = track('intro-kick',
  pattern.pattern('x-------').play(midi.note('C2'))
)

const verseKick = track('verse-kick',
  pattern.pattern('x---x---').play(midi.note('C2'))
)

const verseBass = track('verse-bass',
  pattern.pattern('x-x-x-x-').play(midi.note('C1'))
)

const chorusDrums = group('chorus-drums', [
  track('chorus-kick', pattern.pattern('x---x---x---x---').play(midi.note('C2'))),
  track('chorus-snare', pattern.pattern('----x-------x---').play(midi.note('D2'))),
  track('chorus-hihat', pattern.pattern('x-x-x-x-x-x-x-x-').play(midi.note('F#2')))
])

// Create the arrangement
const mySong = arrangement([
  [2, 'intro', [introKick]],
  [4, 'verse', [verseKick, verseBass]],
  [4, 'chorus', chorusDrums],
  [2, 'outro', [introKick]]
])

// Section info is available in state
const dynamicTrack = (state) => {
  console.log(state.get('section'))      // 'verse', 'chorus', etc.
  console.log(state.get('sectionBar'))   // Bar within current section
  console.log(state.get('absoluteBar'))  // Absolute bar number
  return { actions: [] }
}
```

### State Management

Thrum uses an immutable State object with helpful methods:

```javascript
const { State } = require('thrum/lib-next/state')

// Create state
const state = State.from(0, 0, 0) // bar 0, beat 0, tick 0
const state2 = State.fromTick(96) // from absolute tick number

// Query state
state.isFirstBeatOfBar()  // true if bar start
state.isBeat(2)           // true if on beat 2
state.isBar(0)            // true if on bar 0
state.positionInBar()     // 0-95 for 4/4 time
state.position()          // "1.1.0" (human readable)

// User state for counters, flags, etc.
const state3 = state.withUserState({ counter: 5, mode: 'verse' })
state3.get('counter')     // 5
state3.get('missing', 0)  // 0 (default value)

// State is immutable
state.bar = 5  // throws error
```

Use state in custom tracks:

```javascript
const customTrack = (state) => {
  // Play different notes based on bar number
  if (state.bar % 4 === 0) {
    return { actions: [midi.note('C4')(state)] }
  } else {
    return { actions: [midi.note('E4')(state)] }
  }
}

// Or use state helpers
const onDownbeat = (state) => {
  if (state.isFirstBeatOfBar()) {
    return { actions: [midi.note('C2')(state)] }
  }
  return { actions: [] }
}
```

## Testing and Development

### Simulator

Test your music without MIDI hardware:

```javascript
const { simulator, song, pattern, midi } = require('thrum/lib-next')

const kick = pattern.pattern('x---x---').play(midi.note('C2'))
const mySong = song.create([kick], { tempo: 120 })

const sim = simulator.create(mySong)

// Run for N bars
const results = sim.run(4)
console.log(`Generated ${results.length} events`)

// Get detailed timeline
const timeline = sim.timeline(4)
console.log(`Duration: ${timeline.metadata.durationSeconds}s`)
console.log(`Tempo: ${timeline.metadata.tempo} BPM`)

// Visualize the pattern
console.log(sim.visualize(4))
// Output:
// Tempo: 120 BPM | Meter: 4/4 | Bars: 4
// ────────────────────────────────────────────────────────────────────────────────
// Bar 1: |x      ·      ·      · |·      ·      ·      · |x      ·      ·      · |·      ·      ·      · |
// Bar 2: |x      ·      ·      · |·      ·      ·      · |x      ·      ·      · |·      ·      ·      · |
// ...

// Test a single tick
const result = sim.tick(0)
console.log(result.state)   // { bar: 0, beat: 0, tick: 0 }
console.log(result.actions) // Array of MIDI actions
```

### Writing Tests

Use the simulator in your tests:

```javascript
const test = require('tape')
const { simulator, song, pattern, midi } = require('thrum/lib-next')

test('kick pattern plays on beats 1 and 3', t => {
  const kick = pattern.pattern('x---x---').play(midi.note('C2'))
  const mySong = song.create([kick])
  const sim = simulator.create(mySong)
  
  const results = sim.run(1)
  
  t.equal(results.length, 2, 'two kicks per bar')
  t.equal(results[0].state.beat, 0, 'first kick on beat 1')
  t.equal(results[1].state.beat, 2, 'second kick on beat 3')
  
  t.end()
})
```

## Live Coding Setup

### macOS Setup

1. **Create IAC MIDI Bus:**
   - Open Audio MIDI Setup
   - Window → Show MIDI Studio
   - Double-click "IAC Driver"
   - Check "Device is online"
   - Create a bus named "IAC Driver Bus 1"

2. **Create Project:**

```bash
mkdir my-thrum-project
cd my-thrum-project
npm init -y
npm install thrum
touch .thrumrc
touch music.js
```

3. **Configure `.thrumrc`:**

```json
{
  "livecoding": true,
  "inputs": {
    "1": "IAC Driver Bus 1"
  },
  "outputs": {
    "1": "IAC Driver Bus 1"
  }
}
```

4. **Create `music.js` using the new API:**

```javascript
const pattern = require('thrum/lib-next/pattern')
const midi = require('thrum/lib-next/midi')
const song = require('thrum/lib-next/song')

// Create patterns
const kick = pattern.pattern('x---x---x---x---').play(midi.note('C2', { channel: 9 }))
const snare = pattern.pattern('----x-------x---').play(midi.note('D2', { channel: 9 }))
const hihat = pattern.pattern('x-x-x-x-x-x-x-x-').play(midi.note('F#2', { channel: 9 }))

// Create and export the song
const mySong = song.create([kick, snare, hihat], { tempo: 120 })

module.exports = mySong
```

5. **Start Thrum:**

```bash
thrum music.js
```

Now edit `music.js` and save - your changes will hot reload!

6. **Connect a Synth:**
   - Use a DAW (Reaper, Ableton, etc.) with MIDI input from "IAC Driver Bus 1"
   - Or use a web synth like [Enfer](https://ryanramage.github.io/Enfer/)

## Patterns and Best Practices

### Pattern Design

**Start Simple:**
```javascript
// Basic kick and snare
const kick = pattern.pattern('x---x---').play(midi.note('C2'))
const snare = pattern.pattern('----x-------x---').play(midi.note('D2'))
```

**Add Variation:**
```javascript
// Vary velocity for dynamics
const hihat = pattern.pattern('x-x-x-x-x-x-x-x-').play(
  midi.note('F#2', { velocity: 80 })
)

// Use euclidean rhythms for interesting patterns
const perc = pattern.euclidean(5, 16).play(midi.note('G#2'))
```

**Layer Patterns:**
```javascript
// Combine multiple patterns on the same instrument
const bassLine = group('bass', [
  track('bass-root', pattern.pattern('x-------').play(midi.note('C1'))),
  track('bass-fifth', pattern.pattern('----x---').play(midi.note('G1'))),
  track('bass-octave', pattern.pattern('------x-').play(midi.note('C2')))
])
```

### Track Organization

**Use Named Tracks:**
```javascript
// Good: Easy to identify and control
const kick = track('kick', ...)
const snare = track('snare', ...)

// Not as good: Anonymous functions
const track1 = (state) => { ... }
const track2 = (state) => { ... }
```

**Group Related Tracks:**
```javascript
const drums = group('drums', [kick, snare, hihat])
const bass = group('bass', [bassRoot, bassFifth])
const melody = group('melody', [lead, pad])

const mySong = song.create([drums, bass, melody])
```

**Use Arrangements for Structure:**
```javascript
// Clear song structure
const mySong = arrangement([
  [4, 'intro', introTracks],
  [8, 'verse1', verseTracks],
  [8, 'chorus', chorusTracks],
  [8, 'verse2', verseTracks],
  [8, 'chorus', chorusTracks],
  [4, 'outro', outroTracks]
])
```

### State Management

**Use User State for Counters:**
```javascript
const evolving = (state) => {
  // Get counter from state, default to 0
  const count = state.get('counter', 0)
  
  // Play different notes based on counter
  const notes = ['C4', 'D4', 'E4', 'G4']
  const note = notes[count % notes.length]
  
  // Update counter for next time
  const newState = state.withUserState({ counter: count + 1 })
  
  return { actions: [midi.note(note)(state)] }
}
```

**Query State for Conditional Logic:**
```javascript
const dynamic = (state) => {
  // Different behavior per section
  if (state.isFirstBeatOfBar()) {
    return { actions: [midi.note('C2')(state)] }
  }
  
  // Different behavior per bar
  if (state.bar % 4 === 0) {
    return { actions: [midi.note('C3')(state)] }
  }
  
  return { actions: [] }
}
```

### Performance Tips

**Mute Tracks During Development:**
```javascript
// Mute drums while working on melody
drums.mute()

// Solo just the track you're working on
melody.soloTrack('lead')
```

**Use the Simulator:**
```javascript
// Test patterns before sending to MIDI
const sim = simulator.create(mySong)
console.log(sim.visualize(4))

// Verify timing
const results = sim.run(1)
results.forEach(r => {
  console.log(`Tick ${r.tick}: ${r.actions.length} actions`)
})
```

**Hot Reload Workflow:**
1. Start `thrum music.js`
2. Edit patterns in your editor
3. Save file
4. Changes apply immediately
5. Iterate quickly!

## Advanced Patterns

### Polyrhythms

```javascript
// 3 against 4
const three = pattern.euclidean(3, 12).play(midi.note('C4'))
const four = pattern.pattern('x---x---x---').play(midi.note('E4'))
```

### Probability

```javascript
const probabilistic = (state) => {
  // 50% chance to play
  if (Math.random() > 0.5) {
    return { actions: [midi.note('C4')(state)] }
  }
  return { actions: [] }
}
```

### Generative Sequences

```javascript
const generative = (state) => {
  const scale = ['C4', 'D4', 'E4', 'G4', 'A4']
  const index = state.bar % scale.length
  
  if (state.isFirstBeatOfBar()) {
    return { actions: [midi.note(scale[index])(state)] }
  }
  
  return { actions: [] }
}
```

### Dynamic Velocity

```javascript
const dynamics = (state) => {
  // Crescendo over 4 bars
  const velocity = 60 + (state.bar % 4) * 15
  
  if (state.isFirstBeatOfBar()) {
    return { actions: [midi.note('C4', { velocity })(state)] }
  }
  
  return { actions: [] }
}
```

## API Reference

### Pattern Module

- `pattern.pattern(str)` - Create a pattern from string notation
- `pattern.euclidean(pulses, steps)` - Create euclidean rhythm
- `pattern.play(midiFunc)` - Attach MIDI function to pattern

### MIDI Module

- `midi.note(note, options)` - Create note action
- `midi.chord(notes, options)` - Create chord action
- `midi.cc(controller, value, options)` - Create CC action

### Track Module

- `track(name, trackFunc, options)` - Create named track
- `group(name, tracks, options)` - Create track group
- `arrangement(sections)` - Create section-based arrangement

### Song Module

- `song.create(tracks, options)` - Create song from tracks
- `song.section(barsPerSection, func)` - Create section-based track

### State Module

- `State.from(bar, beat, tick)` - Create state from position
- `State.fromTick(absoluteTick)` - Create state from tick count
- `state.isFirstBeatOfBar()` - Check if bar start
- `state.isBeat(n)` - Check if specific beat
- `state.positionInBar()` - Get position in ticks
- `state.withUserState(updates)` - Create new state with user data
- `state.get(key, default)` - Get user state value

### Simulator Module

- `simulator.create(song, options)` - Create simulator
- `sim.run(bars)` - Run for N bars
- `sim.tick(absoluteTick)` - Run single tick
- `sim.timeline(bars)` - Get detailed timeline
- `sim.visualize(bars)` - ASCII visualization

## Examples

See the `examples/` directory for complete examples:

- `simulator-demo.js` - Basic simulator usage
- `track-demo.js` - Named tracks, groups, and arrangements

## Contributing

Contributions welcome! Please open an issue or PR on GitHub.

## License

MIT

## Links

- [GitHub Repository](https://github.com/ryanramage/thrum)
- [Live Coding Examples](https://github.com/ryanramage/thrum-examples)
- [Web Synth (Enfer)](https://ryanramage.github.io/Enfer/)
