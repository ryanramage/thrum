const test = require('tape')
const toMidi = require('../lib/toMidi.js')

test('test toMidi', t => {
  let spp = 0
  let msg = {
    to: 'toMidi',
    channel: 0,
    note: 'A5'
  }
  let context = {
    midi: {
      'some midi': {
        noteOn: (channel, note, velocity) => {
          t.equals(channel, 0)
          t.equals(note, 'A5')
          t.equals(velocity, 127)
        }
      }
    }
  }
  let scheduled = toMidi(spp, msg, context)
  t.ok(scheduled)
  // note is scheduled to go off
  t.equals(scheduled.spp, 12)
  t.equals(scheduled.name, 'midiOff')
  t.equals(scheduled.msg.note, 'A5')
  t.end()
})

test('test toMidi, length specified', t => {
  let spp = 0
  let msg = {
    to: 'toMidi',
    channel: 0,
    note: 'A5',
    length: '16n'
  }
  let context = {
    midi: {
      'some midi': {
        noteOn: (channel, note, velocity) => {
          t.equals(channel, 0)
          t.equals(note, 'A5')
          t.equals(velocity, 127)
        }
      }
    }
  }
  let scheduled = toMidi(spp, msg, context)
  t.ok(scheduled)
  // note is scheduled to go off
  t.equals(scheduled.spp, 6)
  t.equals(scheduled.name, 'midiOff')
  t.equals(scheduled.msg.note, 'A5')
  t.end()
})

test('test toMidi, bad port', t => {
  let spp = 0
  let msg = {
    to: 'toMidi',
    channel: 0,
    note: 'A5',
    output: 'no thing'
  }
  let context = {
    midi: {
      'some midi': {
        noteOn: (channel, note, velocity) => {
          t.fail('should not get here')
        }
      }
    }
  }
  let scheduled = toMidi(spp, msg, context)
  t.notOk(scheduled)
  t.end()
})
