thrum
-----

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
