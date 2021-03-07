const R = require('ramda')
const lengths = require('../lib/lengths')

module.exports = R.curryN(2, Subdivision)


// type Subdivision =
// "1m" | "1n" | "1n." | "2n" | "2n." | "2t" | "4n" | "4n." | "4t" | "8n" | "8n." | "8t" | "16n" | "16n." | "16t" | "32n" | "32n." | "32t" | "64n" | "64n." | "64t" | "128n" | "128n." | "128t" | "256n" | "256n." | "256t" | "0"
// Represents a subdivision of a measure. The number represents the subdivision. "t" represents a triplet. A "." add a half. e.g. "4n" is a quarter note, "4t" is a quarter note triplet, and "4n." is a dotted quarter note.

let pattern = /(\d+)([mnt]?)(\.?)/i
// takes in a string that represents a subdivision 3m, 8n, 4t and converts it to ticks

function Subdivision ([beatsPerBar, noteLength], subdivision) {
  let [match, number, unit, dot] = subdivision.match(pattern)
  number = Number(number)

  if (number === 0) return 0
  if (unit === 'm') {
    return number * (beatsPerBar * lengths[noteLength])
  }
  if (unit === 'n') {
    let ticks = lengths[`${number}n`]
    if (dot === '.') ticks = ticks + ticks/2
    return ticks
  }
  if (unit === 't') {
    if (number < 2) throw new Error('cant do less than 2 for a triplet')
    // move up and divide by three
    let baseLength = number / 2
    let ticks = lengths[`${baseLength}n`] / 3
    return ticks
  }
}
