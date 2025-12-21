const test = require('tape')
const { tick } = require('../index.js')

test('thrum connect', t => {
  let ok = tick([], {skipConnect: true})
  t.ok(ok)
  t.end()
})
