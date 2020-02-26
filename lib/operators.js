let lengths = require('./lengths')

exports.clock = ({spp}, note, mod) => {
  let on = fun => {}
  let base = lengths[note]
  if (spp % base === 0) {
    if (!mod) mod = 4
    let count = (spp/base) % mod
    on = (fun) => fun.call(null, {count, mod})
  }
  return {on}
}

exports.sawtooth = (i, n, min, max) => {
  i = i + 1
  if (i === n) return max
  if (i === 0) return min
  let t = (i % n) / n
  return Math.floor(min * (1 - t) + max * t)
}

// exports._oscillate = ({spp}, note, mod) => R.ifElse(
//   R.gt(spp % lengths[note], 0),
//   () => ({on: (fun) => fun.call(null, ((spp/lengths[note]) % mod))}),
//   () => ({on: () => {}})
// )

exports.every = (input, rate, mod) => {
  return
}

exports.t = (key, length, track) => {
  let i = key % length
  return track[i]
}
