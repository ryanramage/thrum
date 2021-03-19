const R = require('ramda')
const lengths = require('../lib/lengths')
const expression = require('./expression')

const bars = (baseTimeSignature, structureArray, state) => {

  let [beatsPerBar, noteLength] = baseTimeSignature
  let byStartSPP = structureArray.map(part => {
    let [barStart, barEnd, barFunc] = part
    let nextSPP = (barEnd * (beatsPerBar * lengths[noteLength]))
    let thisBarEndSpp = nextSPP - 1
    let thisBarStartSPP = ((barStart - 1) * (beatsPerBar * lengths[noteLength]))
    return [thisBarStartSPP, thisBarEndSpp, barFunc]
  })

  for (var i = 0; i < byStartSPP.length; i++) {
    let [thisBarStartSPP, thisBarEndSpp, barFunc] = byStartSPP[i]
    if (thisBarStartSPP <= state.spp && state.spp <= thisBarEndSpp) {
      expression(barFunc, state)
    }
  }
  return state
}

module.exports = R.curryN(3, bars)
