const test = require('tape')
const operators = require('../lib/operators.js')

test('t zero index', t => {
  let track = ['a', 'b', 'c', 'd']
  let a = operators.t(0, track)
  t.equals(a, 'a')

  let a2 = operators.t(4, track)
  t.equals(a2, 'a')

  let d = operators.t(3, track)
  t.equals(d, 'd')



  t.end()
})
