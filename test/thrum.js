const test = require('tape')
const { tick } = require('thrum')

test('thrum connect', t => {
  let ok = tick([], {skipConnect: true})
  t.ok(ok)
  t.end()
})
