const { song, track, pattern, midi, shortcuts } = require('thrum')

// Create a simple techno beat
const myTracks = [
  track('kick', 
    pattern('x---x---x---x---').play(
      midi.note(36, { velocity: 110, channel: 9 })
    )
  ),
  
  track('snare',
    pattern('----x-------x---').play(
      midi.note(38, { velocity: 100, channel: 9 })
    )
  ),
  
  track('hihat',
    pattern('x-x-x-x-x-x-x-x-').play(
      midi.note(42, { velocity: 80, channel: 9 })
    )
  )
]

// Export the song
module.exports = song.create(myTracks, {
  tempo: 120,
  meter: [4, 4]
})
