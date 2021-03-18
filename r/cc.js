const R = require('ramda')
const lengths = require('../lib/lengths')

module.exports = R.curryN(4, cc)

function cc(channel, knob, count, value, state) {
  // not sure how to model this properly, so for now
  if (!state) {
    // we got empty options, shuffle
    state = value
    value = count
    count = knob
    knob = channel
    channel = 0
  }
  let _msg = { to: 'toCC', channel, knob, value }
  state.actions.push(_msg)
  return state
}
