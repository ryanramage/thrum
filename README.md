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
