const test = require('tape')
const transpose = require('../r/transpose.js')

test('ignores weird things', t => {
  let exp = 3
  let state = { bah: true, actions: [] }
  let result = transpose(2, exp, state)
  t.deepEquals(state, result)
  t.end()
})
