const R = require('ramda')
const expression = require('./expression')

module.exports = R.curryN(2, expression)
