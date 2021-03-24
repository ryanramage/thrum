const test = require('tape')
const toCC = require('../lib/toCC.js')

test('test toCC', t => {
  let spp = 0
  let msg = {
    to: 'toCC',
    channel: 0,
    knob: 2,
    value: 34
  }
  let context = {
    midi: {
      'some midi': {
        control: (channel, knob, value) => {
          t.equals(channel, 0)
          t.equals(knob, 2)
          t.equals(value, 34)
          t.end()
        }
      }
    }
  }
  toCC(spp, msg, context)
})

test('test toCC, no port found', t => {
  let spp = 0
  let msg = {
    to: 'toCC',
    channel: 0,
    knob: 2,
    value: 34,
    output: 'no thing'
  }
  let context = {
    midi: {
      'some midi': {
        control: (channel, knob, value) => {
          t.fail('should not get here')
        }
      }
    }
  }
  toCC(spp, msg, context)
  t.end()
})
