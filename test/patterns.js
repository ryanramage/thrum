const test = require('tape')
const patterns = require('../lib/patterns.js')

test('expandStr', t => {
  let array = patterns.expandStr('xxx[xx[xx]]')
  t.deepEquals([ 'x', 'x', 'x', [ 'x', 'x', [ 'x', 'x' ] ] ], array)
  t.end()
})

test('recursivelyApplyPatternToNotes', t => {
  let patternArr = [ 'x', 'x', '-', [ 'x', 'x', [ 'x', 'x' ] ] ]
  let result = patterns.recursivelyApplyPatternToNotes(patternArr, 24)
  t.end()
})
