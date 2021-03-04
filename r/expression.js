const R = require('ramda')

module.exports = (exp, state) => {
  if (typeof exp === 'array') {

  }
  if (typeof exp === 'function') {
    return exp(state)
  }
}
