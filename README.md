Priority Order (if implementing incrementally):

 1 #5 (Defaults/Shortcuts) - ✅ Done
 2 #2 (DSL order) - ✅ Done - API now reads naturally: `pattern('x---').play('C4')`
 3 #4 (State management) - ✅ Done - Immutable State class with helper methods
 4 #3 (Track abstraction) - ✅ Done - Named tracks, groups, and arrangements
 5 #1 (Unify API) - Biggest change, but cleanest result

thrum
=====

Thrum is an experiment in making a livecoding music sequencer using functional reducers.

Tools like redux and flux have made a big impact with frontend developers, and as such I am attempting to take
that hammer and nail some midi control with thrum.

Thrum quickstart
=================

Here is a way to get using thrum quickly. IT IS PRETTY HARDCODED TO A MACOS. I will try and make this part easier in the future.

Make sure you have an midi bus
-------------------------------

You need to have your midi bus, and it is labeled 'IAC Driver Bus 1'. This is super common setup. See

 - https://discussions.apple.com/thread/8096575


Install thrum
----------------

Install thrum as a global.

    npm i -g thrum


Create a project directory
---------------------------

```
mkdir test-thrum
cd test-thrum
touch .thrumrc
touch music.js
```

Edit your .thrumrc file
--------------------------

This is the configuration for your project. Its mostly to map midi config. Mine looks like this:

```
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


Edit your music.js file
------------------------------

This file is where you generate sequence midi code. Make one like this

```
const { tick, clip } = require('thrum')

tick([
  clip('-x-x-[xx]-x-x-[xx]-x-[xxx]', ['C4']),
  clip('[xxx]xx[xxx]', ['C5', 'C5', 'C5', 'E5', 'C6', 'F5'], {channel: 12}),
  clip('--x---x---xx', ['b3'], {channel: 6}),
  clip('xxxx', ['C2'])
])

```


Start the thrum process on the command line
---------------------------------------------------------

    thrum music.js

Now each save will hot reload your music

Open a synth
-------------------------------------------------

vist https://ryanramage.github.io/Enfer/

this is an in browser midi synth/sampler. You may have to accept permissions for the page to do midi. Once it loads
you can test that it plays samples with hitting keys like 'z', 'x', 'c'. 'v'


The main thing thrum needs is a clock. pressing 'Space' in Enfer will trigger a clock to start and stop. This will
run the sequencer in your thum file. experiment and have fun


Going further
==============

Here are some examples of song structures using thrum.



Large example

```
const { setup, connect, bars, toMidi, onBeat } = require('thrum')
const config = setup({
  inputs: { 1: 'IAC Driver IAC Bus 2' },
  outputs: { 1: 'IAC Driver Bus 1' }
})
const initialState = {}
const dispatchers = { toMidi }
connect(config, initialState, dispatchers, tick)

function tick (input) {
  return bars(input, [4, '4n'], [
    [1, intro],
    [4, firstVerse],
    [4, chorus],
    [4, secondVerse],
    [4, chorus],
    [2, outro]
  ])
}

function intro ({state, spp}) {
  let actions = []
  if (onBeat(spp, '1n')) actions.push(['toMidi', {note: 'C4', channel: 0}])
  if (onBeat(spp, '4n')) actions.push(['toMidi', {note: 'E5', channel: 1}])
  return {state, actions}
}

function firstVerse ({state, spp}) {
  let actions = []
  if (onBeat(spp, '1n')) actions.push(['toMidi', {note: 'D4', channel: 0}])
  if (onBeat(spp, '4n')) actions.push(['toMidi', {note: 'F5', channel: 1}])
  return {state, actions}
}
function secondVerse ({state, spp}) {
  let actions = []
  if (onBeat(spp, '1n')) actions.push(['toMidi', {note: 'E4', channel: 0}])
  if (onBeat(spp, '4n')) actions.push(['toMidi', {note: 'G5', channel: 1}])
  return {state, actions}
}
function chorus ({state, spp}) {
  let actions = []
  if (onBeat(spp, '8n')) actions.push(['toMidi', {note: 'A2', channel: 1}])
  return {state, actions}
}
function outro ({state, spp}) {  let actions = []
  if (onBeat(spp, '8n')) actions.push(['toMidi', {note: 'B2', channel: 1}])
  return {state, actions}
}

```

And this is what the above sounds like:

[![Watch the video](https://raw.githubusercontent.com/ryanramage/thrum/master/preview.png)](https://youtu.be/6WRXGUzItO0)


For my current set of live examples, see https://github.com/ryanramage/thrum-examples


Smallest thrum file

```
const { tick, clip } = require('thrum')
tick([])
```

Daw
-------------------------------------------------

I use reaper for my daw, and thrum works very well for it

Thrum listens on the midi input defined in step 3 for midi clock events. Something has to generate those. Your DAW or master device will do the trick. In your daw, you will have to create instruments on tracks that will listen for midi events on each channel you want. This will play the midi notes that thrum generates.

Testing and Development
-------------------------------------------------

### Simulator

Thrum includes a simulator that lets you test and develop songs without MIDI hardware. This is useful for:

- Writing unit tests for your songs
- Debugging timing and pattern issues
- Visualizing patterns before playing them
- Running in CI/CD environments

Example usage with the new DSL order:

```javascript
const simulator = require('thrum/lib-next/simulator')
const song = require('thrum/lib-next/song')
const pattern = require('thrum/lib-next/pattern')
const midi = require('thrum/lib-next/midi')

// Create a song using the natural DSL order
const kick = pattern.pattern('x---x---').play(midi.note('C2'))
const snare = pattern.pattern('----x---').play(midi.note('D2'))
const mySong = song.create([kick, snare], { tempo: 120 })

// Create simulator
const sim = simulator.create(mySong)

// Run for 4 bars
const results = sim.run(4)
console.log(`Generated ${results.length} events`)

// Get timeline with timing info
const timeline = sim.timeline(4)
console.log(`Duration: ${timeline.metadata.durationSeconds}s`)

// Visualize the pattern
console.log(sim.visualize(4))
```

See `examples/simulator-demo.js` for a complete example.

### New DSL Order (lib-next)

The new API in `lib-next/` uses a more natural, chainable syntax:

```javascript
// Old style (still works in lib/)
pattern('x---', play('C4'))

// New style (lib-next/)
pattern('x---').play(note('C4'))
```

This makes the code read more naturally from left to right: "create a pattern, then play a note".

### State Management (lib-next)

The new State class provides immutable state with helpful methods:

```javascript
const { State } = require('thrum/lib-next/state')

// Create state
const state = State.from(0, 0, 0) // bar 0, beat 0, tick 0
const state2 = State.fromTick(96) // from absolute tick

// Helper methods
state.isFirstBeatOfBar()  // true if bar 0, beat 0, tick 0
state.isBeat(2)           // true if on beat 2
state.isBar(0)            // true if on bar 0
state.positionInBar()     // 0-95 for 4/4 time
state.position()          // "1.1.0" (human readable)

// User state (for counters, etc.)
const state3 = state.withUserState({ counter: 5 })
state3.get('counter')     // 5
state3.get('missing', 0)  // 0 (default value)

// Immutable - properties cannot be changed
state.bar = 5  // throws error
```

Tracks receive State objects automatically:

```javascript
const track = (state) => {
  if (state.isFirstBeatOfBar()) {
    return { actions: [midi.note('C4')(state)] }
  }
  return { actions: [] }
}
```

### Track Abstraction (lib-next)

Named tracks, groups, and arrangements for better song organization:

```javascript
const { track, group, arrangement } = require('thrum/lib-next/track')
const pattern = require('thrum/lib-next/pattern')
const midi = require('thrum/lib-next/midi')

// Named tracks
const kick = track('kick',
  pattern.pattern('x---x---').play(midi.note('C2'))
)

const snare = track('snare',
  pattern.pattern('----x---').play(midi.note('D2'))
)

// Track groups (busses)
const drums = group('drums', [kick, snare])

// Mute/solo controls
kick.mute()
kick.unmute()
kick.toggleMute()

drums.muteTrack('kick')
drums.soloTrack('snare')
drums.unsoloAll()

// Song arrangements with sections
const mySong = arrangement([
  [2, 'intro', introTracks],
  [4, 'verse', verseTracks],
  [4, 'chorus', chorusTracks],
  [2, 'outro', outroTracks]
])

// Section info is available in state
const verseTrack = (state) => {
  console.log(state.get('section'))      // 'verse'
  console.log(state.get('sectionBar'))   // bar within section
  console.log(state.get('absoluteBar'))  // absolute bar number
  return { actions: [] }
}
```

See `examples/track-demo.js` for complete examples.
