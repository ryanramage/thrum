const R = require('ramda')

// Drum shortcuts - common drum patterns
module.exports = (meter) => {
  const pattern = require('./pattern')(meter)
  const play = require('./play')
  
  return {
    // Basic drum patterns
    kick: (patternStr) => {
      const defaultPattern = 'x---x---x---x---' // 4 on the floor
      return (state) => pattern(patternStr || defaultPattern, play('C1'), state)
    },
    
    snare: (patternStr) => {
      const defaultPattern = '----x-------x---' // backbeat
      return (state) => pattern(patternStr || defaultPattern, play('D1'), state)
    },
    
    hihat: (patternStr) => {
      const defaultPattern = 'x-x-x-x-x-x-x-x-' // 8th notes
      return (state) => pattern(patternStr || defaultPattern, play('F#1'), state)
    },
    
    closedHat: (patternStr) => {
      const defaultPattern = 'x-x-x-x-x-x-x-x-'
      return (state) => pattern(patternStr || defaultPattern, play('F#1'), state)
    },
    
    openHat: (patternStr) => {
      const defaultPattern = '--x---x---x---x-'
      return (state) => pattern(patternStr || defaultPattern, play('A#1'), state)
    },
    
    clap: (patternStr) => {
      const defaultPattern = '----x-------x---'
      return (state) => pattern(patternStr || defaultPattern, play('D#1'), state)
    },
    
    rim: (patternStr) => {
      const defaultPattern = '----x-------x---'
      return (state) => pattern(patternStr || defaultPattern, play('C#1'), state)
    },
    
    // Preset drum kits
    fourOnFloor: () => [
      (state) => pattern('x---x---x---x---', play('C1'), state),  // kick
      (state) => pattern('----x-------x---', play('D1'), state),  // snare
      (state) => pattern('x-x-x-x-x-x-x-x-', play('F#1'), state)  // hihat
    ],
    
    breakbeat: () => [
      (state) => pattern('x---x-x---x-x---', play('C1'), state),  // syncopated kick
      (state) => pattern('----x-------x---', play('D1'), state),  // snare
      (state) => pattern('x-x-x-x-x-x-x-x-', play('F#1'), state)  // hihat
    ]
  }
}
