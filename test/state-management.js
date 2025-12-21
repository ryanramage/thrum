const test = require('tape')
const thrum = require('../index').meter(4, '4n')

test('thrum.test() - simple usage', t => {
  const { actions, spp } = thrum.test([
    thrum.repeat('4n', thrum.play('C4'))
  ])
  
  t.ok(actions, 'returns actions')
  t.equals(spp, 0, 'default spp is 0')
  t.ok(actions.length > 0, 'has actions')
  t.equals(actions[0].note, 'C4', 'correct note')
  
  t.end()
})

test('thrum.test() - with custom spp', t => {
  const { actions, spp } = thrum.test([
    thrum.repeat('4n', thrum.play('C4'))
  ], { spp: 96 })
  
  t.equals(spp, 96, 'spp is set correctly')
  
  t.end()
})

test('thrum.test() - with userState', t => {
  const { userState } = thrum.test([
    (state) => {
      state.userState.counter = 42
      return state
    }
  ], { userState: { initial: true } })
  
  t.ok(userState.initial, 'initial userState preserved')
  t.equals(userState.counter, 42, 'userState modified')
  
  t.end()
})

test('thrum.create() - basic usage', t => {
  const song = thrum.create()
  
  const result = song.tick([
    thrum.repeat('4n', thrum.play('C4'))
  ])
  
  t.ok(result.actions, 'returns actions')
  t.equals(result.spp, 0, 'initial spp is 0')
  
  t.end()
})

test('thrum.create() - advance time', t => {
  const song = thrum.create()
  
  song.tick([thrum.repeat('4n', thrum.play('C4'))])
  
  song.advance(96) // advance one quarter note
  
  const result = song.tick([thrum.repeat('4n', thrum.play('D4'))])
  
  t.equals(result.spp, 96, 'spp advanced correctly')
  
  t.end()
})

test('thrum.create() - reset', t => {
  const song = thrum.create()
  
  song.advance(96)
  song.reset()
  
  const result = song.tick([thrum.repeat('4n', thrum.play('C4'))])
  
  t.equals(result.spp, 0, 'spp reset to 0')
  
  t.end()
})

test('thrum.create() - getState and setState', t => {
  const song = thrum.create()
  
  song.tick([
    (state) => {
      state.userState.foo = 'bar'
      return state
    }
  ])
  
  const state = song.getState()
  t.equals(state.userState.foo, 'bar', 'getState returns current state')
  
  song.setState({ spp: 200, userState: { baz: 'qux' }, actions: [] })
  
  const result = song.tick([thrum.repeat('4n', thrum.play('C4'))])
  t.equals(result.spp, 200, 'setState updates spp')
  t.equals(result.userState.baz, 'qux', 'setState updates userState')
  
  t.end()
})

test('thrum.create() - with initial options', t => {
  const song = thrum.create({ 
    spp: 48, 
    userState: { initialized: true } 
  })
  
  const result = song.tick([thrum.repeat('4n', thrum.play('C4'))])
  
  t.equals(result.spp, 48, 'initial spp set')
  t.ok(result.userState.initialized, 'initial userState set')
  
  t.end()
})

test('thrum.create() - actions cleared between ticks', t => {
  const song = thrum.create()
  
  const result1 = song.tick([thrum.repeat('4n', thrum.play('C4'))])
  t.ok(result1.actions.length > 0, 'first tick has actions')
  
  song.advance(24)
  
  const result2 = song.tick([]) // empty expressions
  t.equals(result2.actions.length, 0, 'actions cleared for new tick')
  
  t.end()
})
