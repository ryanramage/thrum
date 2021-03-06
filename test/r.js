const test = require('tape')
const R = require('ramda')
const Tonal = require('@tonaljs/tonal')

const tick = require('../r/tick')
const bars = require('../r/bars')
const pattern = require('../r/pattern')
const play = require('../r/play')
const transpose = require('../r/transpose')
const SongState = require('../r/songState')

test('tick with bars', t => {
  let state = SongState.set({spp: 0, userState: {}, actions: []})

  let cscale5 = Tonal.Scale.get("C major").notes.map(i => `${i}5`)
  let quarterNotePattern = pattern('xxxx')
  let quarterNoteCscale = quarterNotePattern(play(cscale5))
  let upScale = transpose('5P', quarterNoteCscale)

// probably use evolve underneath?
// let sineVelocity = modulate('8n', {
//   velocity: sawtooth(7, 127) // hi/lo range
// })
// let modulatedQuarterNoteCscale = sineVelocity(quarterNoteCscale)

  let output = tick(bars([4, '4n'], [
      [1, 1, upScale]
    , [2, 2, quarterNoteCscale]
    , [3, 8, upScale]
  //  , [3, 8, modulatedQuarterNoteCscale]
  ]))(state)

  t.equals(output.spp, 0)
  console.log(state)
  t.end()
})
