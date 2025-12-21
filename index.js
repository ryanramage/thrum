// Main API exports for Thrum
const song = require('./lib/song')
const { pattern, euclidean } = require('./lib/pattern')
const midi = require('./lib/midi')
const structure = require('./lib/structure')
const { track, group, arrangement } = require('./lib/track')
const simulator = require('./lib/simulator')
const { State } = require('./lib/state')
const shortcuts = require('./lib/shortcuts')

module.exports = {
  song,
  pattern,
  euclidean,
  midi,
  structure,
  track,
  group,
  arrangement,
  simulator,
  State,
  shortcuts
}
