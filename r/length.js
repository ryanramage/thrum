const R = require('ramda')
const Subdivision = require('./subdivision')

module.exports = R.curryN(2, operator)

function operator (meter, subdivision, velocity) {
  let length = Subdivision(meter, subdivision)
  let options = { length }
  if (velocity) options.velocity = velocity
  return options
}
