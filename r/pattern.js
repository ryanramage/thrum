const R = require('ramda')
const lengths = require('../lib/lengths')

const clip = (str, operator, state) => ops_clip(compile(str, '4n'), operator, state)
module.exports = R.curryN(3, clip)

function ops_clip (compiled, operator, state) {
  let internalSpp = state.spp % compiled.totalLength
  let startTime = 0
  let count = 0

  //  this loop, short circut return
  compiled.clipNotes.forEach((item, i) => {
    let clipIndex = count
    if (!item.rest) count++
    // if (count > compiled.xCount) count = 0 // I cant find a case for this. commenting out until I do
    if (internalSpp == startTime && !item.rest) operator(clipIndex, item.length, state)
    startTime += item.length
  })
  return state
}

function compile (str, length) {
  let array = expandStr(str)
  let noteLength = lengths[length]
  return compileArray(array, noteLength)
}

function compileArray (patternArr, noteLength) {
  return recursivelyApplyPatternToNotes(patternArr, noteLength)
}

/**
 * Take a String input such as xxx[xx[xx]]
 * and return an Array as ['x', 'x', 'x', ['x', 'x', ['x', 'x']]]
 */
function expandStr (str) {
  str = JSON.stringify(str.split(''))
  str = str.replace(/,"\[",/g, ', [')
  str = str.replace(/"\[",/g, '[')
  str = str.replace(/,"\]"/g, ']')
  return JSON.parse(str)
}

function recursivelyApplyPatternToNotes (patternArr, length, details) {
  if (!details) details = { totalLength: patternArr.length * length, clipNotes: [], xCount: 0}
  patternArr.forEach(char => {
    if (typeof char === 'string') {
      let note;
      // Push only note on OR off messages to the clip notes array
      if (char === 'x') {
        details.clipNotes.push({
          length
        })
        details.xCount++
      }
      if (char === '-') {
        details.clipNotes.push({
          rest: true,
          length
        })
      }

      // In case of an underscore, simply extend the previous note's length
      if (char === '_' && details.clipNotes.length) {
        details.clipNotes[details.clipNotes.length - 1].length += length;
      }
    }
    if (Array.isArray(char)) {
      recursivelyApplyPatternToNotes(char, length / char.length, details)
    }
  })
  return details
}
