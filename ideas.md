const { tick, ops } = require('thrum')
tick(input => {
  let actions = []
  let notes = ['C3', 'C2', 'F2', 'G3', 'E2', 'G#2', 'F3', 'E2', 'G2', 'E3']
  ops.clock(input, '8n', 10).on(({count, mod}) => {
    let velocity = ops.sawtooth(count, mod, 7, 127)
    let note = notes[count % ((notes.length))]
    actions.push(['toMidi', {note, velocity}])
  })
  ops.clock(input, '4n', 22).on(({count, mod}) => {
    let velocity = ops.sawtooth(count, mod, 7, 90)
    let note = notes[count % ((notes.length))]
    actions.push(['toMidi', {note, velocity, channel: 1, length: 50}])
  })
  return {actions}
})


 clip('xxxx', ['C5'], {channel: 0})
 clip('xxxx', )


// move input to END, that way can be fluent ()
const { tick, ops } = require('thrum')
const {AMaj7} = require('chords')
const piece = bars([4, '4n'], [
  [4, 8, clip('-x-x-[xx]-x-x-[xx]-x-[xxx]', ['A3', 'B4'])],
  [4, 8, cc(28), ]
  [8, 12, clip('-x-x-[xx]-x-x-[xx]-x-[xxx]', AMaj7, {
    velocity: modulate('4n', 22, )
  })]
])
tick(piece)



const spp = 3
let actions = []
let state = {spp, actions}

let internalTick = (state, action) => R.concat(state.actions, action(state))

let tick = ({_spp, actions}) => [
  {play: 'C5'},
  {play: 'C3'}
]

reduce(internalTick, state, [tick])
