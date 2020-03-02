let lengths = require('./lengths')

exports.clock = ({spp}, note, mod) => {
  let on = fun => { return [] }
  let base = lengths[note]
  if (spp % base === 0) {
    if (!mod) mod = 4
    let count = (spp/base) % mod
    on = (fun) => fun.call(null, count, mod)
  }
  return {on}
}

exports.clip = ({spp}, compiled) => {
  let on = fun => { return [] }
  let internalSpp = spp % compiled.totalLength
  let startTime = 0
  let count = 0
  compiled.clipNotes.forEach((item, i) => {
    if (internalSpp == startTime) {
      if (!item.rest) on = (fun) => fun.call(null, count++, item.length)
    }
    if (count > compiled.clipNotes.length) count = 0

    startTime += item.length
  })
  return {on}
}

exports.sawtooth = (i, n, min, max) => {
  i = i + 1
  if (i === n) return max
  if (i === 0) return min
  let t = (i % n) / n
  return Math.floor(min * (1 - t) + max * t)
}

exports.t = (key, track) => {
  let length = track.length
  let i = key % length
  return track[i]
}
