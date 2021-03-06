const test = require('tape')

test('basic subdivisions in 4/4 time', t => {
  const Subdiv4_4 = require('../r/subdivision.js')([4, '4n'])
  t.equals(Subdiv4_4('0'), 0)
  t.equals(Subdiv4_4('4n'), 24)
  t.equals(Subdiv4_4('1m'), 24 * 4)
  t.equals(Subdiv4_4('2m'), 24 * 4 * 2)
  t.equals(Subdiv4_4('4n.'), 36)
  t.equals(Subdiv4_4('1n.'), 144)
  t.equals(Subdiv4_4('8t'), 8)
  t.equals(Subdiv4_4('2t'), 32)
  try {
    Subdiv4_4('1t', 32)
    t.fail()
  } catch (e) { t.ok(e) }
  t.equals(Subdiv4_4('3C'), 0)
  t.end()
})

test('basic subdivisions in 3/4 time', t => {
  const Subdiv3_4 = require('../r/subdivision.js')([3, '4n'])
  t.equals(Subdiv3_4('0'), 0)
  t.equals(Subdiv3_4('4n'), 24)
  t.equals(Subdiv3_4('1m'), 24 * 3)
  t.equals(Subdiv3_4('2m'), 24 * 3 * 2)
  t.equals(Subdiv3_4('4n.'), 36)
  t.equals(Subdiv3_4('1n.'), 144)
  t.equals(Subdiv3_4('8t'), 8)
  t.equals(Subdiv3_4('2t'), 32)
  t.end()
})
