thrum
=====

Thrum is an experiment in making a livecoding music sequencer using functional reducers.

Tools like redux and flux have made a big impact with frontend developers, and as such I am attempting to take
that hammer and nail some midi control with thrum.

Here is currently how a song structure looks like with thrum.

```
const { setup, connect, bars, toMidi, onBeat } = require('thrum')
const config = setup({
  input: { 1: 'IAC Driver IAC Bus 2' },
  output: { 1: 'IAC Driver Bus 1' }
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


livecoding
==========

Thrum is setup for livecoding in any editor you choose. When you save in your editor, the music will seamlessly update. Here is the process for doing that.

1. Install dependencies
------------------------

Install thrum as a global. Nodemon is recommended for livereload coding.

```
npm i -g thrum nodemon

2. create your file for music
------------------------------

```
touch music.js
```

3. start the thrum-livecoding process on the command line
---------------------------------------------------------

Pass in the midi bus that will have the main midi clock your daw is sending out on

```
thrum-livecoding 'IAC Driver IAC Bus 2'
```

4. create your music. set livecoding to true
----------------------------------------------

```
const { setup, connect, bars, toMidi, onBeat } = require('thrum')
const config = setup({
  livecoding: true, // IMPORTANT - this tells thrum you are livecoding.
  input: { 1: 'IAC Driver IAC Bus 2' },
  output: { 1: 'IAC Driver Bus 1' }
})
const initialState = {}
const dispatchers = { toMidi }
connect(config, initialState, dispatchers, tick)

function tick (input) {
  let actions = []
  if (onBeat(spp, '1n')) actions.push(['toMidi', {note: 'C4', channel: 0}])
  if (onBeat(spp, '4n')) actions.push(['toMidi', {note: 'E5', channel: 1}])
  return {state, actions}
}
```

5. turn on nodemon.
--------------------------------------------------------------------------

in another command line run

```
nodemon music.js
```

Now each save will hot reload your music
