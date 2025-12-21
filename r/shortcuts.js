const R = require('ramda')

// Drum shortcuts - common drum patterns
module.exports = (meter) => {
  const pattern = require('./pattern')(meter)
  const play = require('./play')
  
  return {
    // Basic drum patterns
    kick: (patternStr) => {
      const defaultPattern = 'x---x---x---x---' // 4 on the floor
      return pattern(patternStr || defaultPattern, play('C1'))
    },
    
    snare: (patternStr) => {
      const defaultPattern = '----x-------x---' // backbeat
      return pattern(patternStr || defaultPattern, play('D1'))
    },
    
    hihat: (patternStr) => {
      const defaultPattern = 'x-x-x-x-x-x-x-x-' // 8th notes
      return pattern(patternStr || defaultPattern, play('F#1'))
    },
    
    closedHat: (patternStr) => {
      const defaultPattern = 'x-x-x-x-x-x-x-x-'
      return pattern(patternStr || defaultPattern, play('F#1'))
    },
    
    openHat: (patternStr) => {
      const defaultPattern = '--x---x---x---x-'
      return pattern(patternStr || defaultPattern, play('A#1'))
    },
    
    clap: (patternStr) => {
      const defaultPattern = '----x-------x---'
      return pattern(patternStr || defaultPattern, play('D#1'))
    },
    
    rim: (patternStr) => {
      const defaultPattern = '----x-------x---'
      return pattern(patternStr || defaultPattern, play('C#1'))
    },
    
    // Preset drum kits
    fourOnFloor: () => [
      pattern('x---x---x---x---', play('C1')),  // kick
      pattern('----x-------x---', play('D1')),  // snare
      pattern('x-x-x-x-x-x-x-x-', play('F#1'))  // hihat
    ],
    
    breakbeat: () => [
      pattern('x---x-x---x-x---', play('C1')),  // syncopated kick
      pattern('----x-------x---', play('D1')),  // snare
      pattern('x-x-x-x-x-x-x-x-', play('F#1'))  // hihat
    ]
  }
}
