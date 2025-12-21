const R = require('ramda')

// Drum shortcuts - common drum patterns
module.exports = (meter) => {
  const pattern = require('./pattern')(meter)
  const play = require('./play')
  
  return {
    // Basic drum patterns
    kick: (patternStr) => {
      const defaultPattern = 'x---x---x---x---' // 4 on the floor
      return (state) => {
        const playOp = (count, length, st) => play('C1', count, length, st)
        return pattern(patternStr || defaultPattern, playOp)(state)
      }
    },
    
    snare: (patternStr) => {
      const defaultPattern = '----x-------x---' // backbeat
      return (state) => {
        const playOp = (count, length, st) => play('D1', count, length, st)
        return pattern(patternStr || defaultPattern, playOp)(state)
      }
    },
    
    hihat: (patternStr) => {
      const defaultPattern = 'x-x-x-x-x-x-x-x-' // 8th notes
      return (state) => {
        const playOp = (count, length, st) => play('F#1', count, length, st)
        return pattern(patternStr || defaultPattern, playOp)(state)
      }
    },
    
    closedHat: (patternStr) => {
      const defaultPattern = 'x-x-x-x-x-x-x-x-'
      return (state) => {
        const playOp = (count, length, st) => play('F#1', count, length, st)
        return pattern(patternStr || defaultPattern, playOp)(state)
      }
    },
    
    openHat: (patternStr) => {
      const defaultPattern = '--x---x---x---x-'
      return (state) => {
        const playOp = (count, length, st) => play('A#1', count, length, st)
        return pattern(patternStr || defaultPattern, playOp)(state)
      }
    },
    
    clap: (patternStr) => {
      const defaultPattern = '----x-------x---'
      return (state) => {
        const playOp = (count, length, st) => play('D#1', count, length, st)
        return pattern(patternStr || defaultPattern, playOp)(state)
      }
    },
    
    rim: (patternStr) => {
      const defaultPattern = '----x-------x---'
      return (state) => {
        const playOp = (count, length, st) => play('C#1', count, length, st)
        return pattern(patternStr || defaultPattern, playOp)(state)
      }
    },
    
    // Preset drum kits
    fourOnFloor: () => [
      (state) => {
        const playOp = (count, length, st) => play('C1', count, length, st)
        return pattern('x---x---x---x---', playOp)(state)
      },
      (state) => {
        const playOp = (count, length, st) => play('D1', count, length, st)
        return pattern('----x-------x---', playOp)(state)
      },
      (state) => {
        const playOp = (count, length, st) => play('F#1', count, length, st)
        return pattern('x-x-x-x-x-x-x-x-', playOp)(state)
      }
    ],
    
    breakbeat: () => [
      (state) => {
        const playOp = (count, length, st) => play('C1', count, length, st)
        return pattern('x---x-x---x-x---', playOp)(state)
      },
      (state) => {
        const playOp = (count, length, st) => play('D1', count, length, st)
        return pattern('----x-------x---', playOp)(state)
      },
      (state) => {
        const playOp = (count, length, st) => play('F#1', count, length, st)
        return pattern('x-x-x-x-x-x-x-x-', playOp)(state)
      }
    ]
  }
}
