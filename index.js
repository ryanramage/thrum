// Main API exports for Thrum
const song = require('./lib/song')
const pattern = require('./lib/pattern')
const midi = require('./lib/midi')
const structure = require('./lib/structure')
const track = require('./lib/track')
const simulator = require('./lib/simulator')
const { State } = require('./lib/state')

module.exports = {
  song,
  pattern,
  midi,
  structure,
  track,
  simulator,
  State
}
