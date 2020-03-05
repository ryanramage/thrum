thrum
=====

Thrum is an experiment in making a livecoding music sequencer using functional reducers.

Tools like redux and flux have made a big impact with frontend developers, and as such I am attempting to take
that hammer and nail some midi control with thrum.

Here are some examples of song structures using thrum.

Small example
```
const { tick, clip } = require('thrum')

tick([
  clip('xxxx', ['C5'], {channel: 0}),
  clip('x-x-', ['C5'], {channel: 5}),
  clip('[xx][xx][xx][xx][xx][xx][xx][xx][xx][xx][xx][xx][xx][xx][xx][x[xxxx]]', ['C5'], {channel: 4, velocity: 10}),
  clip('[x-x]x[xx]xx-[xx]-[xxx]-[xx]-x-[xx][xxxx][x-x]-[xx]-x-[xxxx][xxxx]', ['C3', 'C2', 'C3', 'C2', 'E2', 'G2', 'C3'], {channel: 7})
])


```

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


livecoding
==========

Thrum is setup for livecoding in any editor you choose. When you save in your editor, the music will seamlessly update. Here is the process for doing that.

1. Install dependencies
------------------------

Install thrum as a global.

    npm i -g thrum

2. Create a project directory
------------------------------

```
mkdir test-thrum
cd test-thrum
touch .thrumrc
touch music.js
```

3. Edit your .thrumrc file
--------------------------

This is the configuration for your project. Its mostly to map midi config. Mine looks like this:

```
{
  "livecoding": true,
  "inputs": {
    "1": "IAC Driver IAC Bus 2"
  },
  "outputs": {
    "1": "IAC Driver Bus 1"
  }
}
```

The input number one should be where your midi clock comes in. on ios you probably want "IAC Driver Bus 1" but I have 2 busses for other reasons.

The output is to connect to any midi devices. I just write to the main osx bus.



4. edit your music.js file
------------------------------

This file is where you generate sequence midi code. The smallest one looks like:

```
const { tick, clip } = require('thrum')
tick([])
```


5. start the thrum process on the command line
---------------------------------------------------------

    thrum music.js

Now each save will hot reload your music

6. fire up your daw and start/loop the midi clock
-------------------------------------------------

Thrum listens on the midi input defined in step 3 for midi clock events. Something has to generate those. Your DAW or master device will do the trick. In your daw, you will have to create instruments on tracks that will listen for midi events on each channel you want. This will play the midi notes that thrum generates.
