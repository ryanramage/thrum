const test = require('tape')
const expression = require('../r/expression.js')

test('ignores weird things', t => {
  let exp = 3
  let state = { bah: true }
  let result = expression(exp, state)
  t.deepEquals(state, result)
  t.end()
})
