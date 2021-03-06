const test = require('tape')
const SongState = require('../r/songState.js')

test('immutable spp', t => {
  let state = SongState.set({spp: 3})
  state.spp = 22
  t.equals(state.spp, 3)
  t.end()
})

test('clone song state', t => {
  let state = SongState.set({spp: 3, userState: {}})
  let updates = SongState.set({...state, userState: {key: 'G'}})
  t.end()
})

test('add actions song state', t => {
  let state = SongState.set({spp: 3, userState: {}, actions: []})
  state.actions.push({test: true})
  t.end()
})
