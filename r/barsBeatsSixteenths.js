// time encoded as Bars:Beats:Sixteenths:(ticks).
const lengths = require('../lib/lengths')
const R = require('ramda')


function parse ([beatsPerBar, noteLength], transportTime) {
  let [bar, beat, sixteenth, ticks] = transportTime.split(':').map(n => Number(n))
  if (bar === 0) throw new Error('bar cant be 0. Must be one or greater')
  // should we make sure that beat not greater than beatsPerBar?
  if (beat === 0) throw new Error('beat cant be 0. Must be one or greater')
  if (beat > beatsPerBar) throw new Error('beat cant be greater than beatsPerBar')


  let spp = ((bar - 1) * (beatsPerBar * lengths[noteLength]))
    + ((beat - 1) * lengths[noteLength])

  if (sixteenth) spp += ((lengths['1n']/16) * sixteenth)

  // should check that ticks does not exceed its bounds. But maybe this is a feature so people can
  // reach out of boundries with it?
  if (ticks) spp += ticks

  return spp
}

module.exports = R.curryN(2, parse)
