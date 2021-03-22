const R = require('ramda')
const Subdivision = require('./subdivision')

module.exports = R.curryN(2, operator)

function operator (meter, subdivision, velocity) {
  let length = Subdivision(meter, subdivision)
  let options = {}
  if (typeof velocity === 'object') options = velocity
  else if (velocity) options.velocity = velocity
  options.length = length
  return options
}
