const R = require('ramda')

module.exports = (exp, state) => {
  if (Array.isArray(exp)) {
    exp.forEach(e => module.exports(e, state))
    return state
  }
  if (typeof exp === 'function') {
    return exp(state)
  }
  return state // not sure what this is, just going to ignore
}
