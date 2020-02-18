const test = require('tape')
const forca = require('../index.js')

let songStructure = [
  [1, intro],
  [4, firstVerse],
  [4, chorus],
  [4, secondVerse],
  [4, chorus],
  [2, outro]
]

test('bars', t => {
  let spp = 0
  let state = {}
  let output = forca.bars({spp, state}, [4, '4n'], songStructure)
  t.ok(output)
  t.equals(output.actions.length, 1) // at this spp, we are in the intro
  t.end()
})

test('bars', t => {
  let spp = 1
  let state = {}
  let output = forca.bars({spp, state}, [4, '4n'], songStructure)
  t.ok(output)
  t.equals(output.actions.length, 1) // at this spp, we are in the intro
  t.end()
})

test('bars', t => {
  let spp = 95
  let state = {}
  let output = forca.bars({spp, state}, [4, '4n'], songStructure)
  t.ok(output)
  t.equals(output.actions.length, 1) // at this spp, we are in the intro
  t.end()
})

test('bars', t => {
  let spp = 96
  let state = {}
  let output = forca.bars({spp, state}, [4, '4n'], songStructure)
  t.ok(output)
  t.equals(output.actions.length, 2) // at this spp, we are in the first verse
  t.end()
})

function intro ({state, spp}) {return {state, actions: [{}]}}
function firstVerse ({state, spp}) {return {state, actions: [{}, {}]}}
function secondVerse ({state, spp}) { return {state, actions: [{}, {}, {}]}}
function chorus ({state, spp}) { return {state, actions: [{}, {}, {}, {}]}}
function outro ({state, spp}) { return {state, actions: [{}, {}, {}, {}, {}]}}
