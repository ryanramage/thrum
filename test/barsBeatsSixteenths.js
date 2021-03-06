const test = require('tape')
const BarsBeatsSixteenths = require('../r/barsBeatsSixteenths.js')

test('example cases beats:bars:sixteenth', t => {
  let timeSignature = [4, '4n']
  let _4_4_time = BarsBeatsSixteenths(timeSignature)
  t.equals(_4_4_time('1:1:0'), 0)
  t.equals(_4_4_time('1:1:1'), 6)
  t.equals(_4_4_time('1:1:2'), 12)
  t.equals(_4_4_time('1:1:3'), 18)
  t.equals(_4_4_time('1:2:0'), 24)
  t.equals(_4_4_time('1:2:1'), 30)
  t.equals(_4_4_time('1:3:0'), 48)
  t.equals(_4_4_time('1:4:0'), 72)
  t.equals(_4_4_time('1:4:3'), 90)
  t.equals(_4_4_time('2:1:0'), 96)
  t.end()
})

// throwing errors is not very funcional, but I dont want to do fantasy land.
// user can just fix the program
test('errors', t => {
  let timeSignature = [4, '4n']
  let _4_4_time = BarsBeatsSixteenths(timeSignature)
  try { _4_4_time('0:1:0'); t.fail() } catch (e) { t.ok(e) }
  try { _4_4_time('1:0:0'); t.fail() } catch (e) { t.ok(e) }
  try { _4_4_time('1:5:0'); t.fail() } catch (e) { t.ok(e) }
  t.end()
})

test('add some ticks to the array', t => {
  let timeSignature = [4, '4n']
  let _4_4_time = BarsBeatsSixteenths(timeSignature)
  t.equals(_4_4_time('1:1:0:1'), 1)
  t.equals(_4_4_time('1:1:1:3'), 9)
  t.equals(_4_4_time('2:1:0:2'), 98)
  t.end()
})
