const R = require('ramda')
const lengths = require('../lib/lengths')

module.exports = R.curryN(3, clip)

function clip (str, notes, input) => ops_clip(compile(str, '4n'), input)

  // let clip = (input, actions) => ops_clip(input, pattern).on((count, length) => {
  //   let _msg = msg.toObject()
  //   _msg.note = ops.t(count, notes)
  //   _msg.length = length
  //   actions.push(_msg)
  //   return actions
  // })
  // return clip


function ops_clip (compiled, {spp}) {
  let internalSpp = spp % compiled.totalLength
  let startTime = 0
  let count = 0
  console.log(compiled)
  let actions = []
  compiled.clipNotes.forEach((item, i) => {
    let clipIndex = count
    if (!item.rest) count++
    if (count > compiled.xCount) count = 0
    if (internalSpp == startTime && !item.rest) {

      if (!item.rest) on = (fun) => fun.call(null, clipIndex, item.length)
    }
    startTime += item.length
  })
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
