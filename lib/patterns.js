const { Map } = require('immutable')
const lengths = require('./lengths')
const ops = require('./operators')

exports.clip = function (str, notes, defaultMsg) {
  if (!defaultMsg) defaultMsg = {}
  let msg = Map(defaultMsg)
  let pattern = exports.compile(str, '4n')
  let clip = (input, actions) => ops.clip(input, pattern).on((count, length) => {
    let _msg = msg.toObject()
    _msg.note = ops.t(count, notes)
    _msg.length = length
    actions.push(_msg)
  })
  return clip
}


exports.compile = function (str, length) {
  let array = exports.expandStr(str)
  let noteLength = lengths[length]
  return exports.compileArray(array, noteLength)
}

exports.compileArray = function (patternArr, noteLength) {
  return exports.recursivelyApplyPatternToNotes(patternArr, noteLength)
  //return exports.calculateClock(pattern, noteLength)
}


/**
 * Take a String input such as xxx[xx[xx]]
 * and return an Array as ['x', 'x', 'x', ['x', 'x', ['x', 'x']]]
 */
exports.expandStr = (str) => {
  str = JSON.stringify(str.split(''))
  str = str.replace(/,"\[",/g, ', [')
  str = str.replace(/"\[",/g, '[')
  str = str.replace(/,"\]"/g, ']')
  return JSON.parse(str)
}

exports.recursivelyApplyPatternToNotes = (patternArr, length, details) => {
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
      exports.recursivelyApplyPatternToNotes(char, length / char.length, details)
    }
  })
  return details
}
