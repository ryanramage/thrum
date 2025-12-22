const { song, pattern, midi, track } = require('./index')

// Create some tracks using the new structure
const kickTrack = track('kick', 
  pattern('x---x---x---x---').play(() => 
    midi.note(36, { velocity: 100, channel: 9 })
  )
)

const snareTrack = track('snare',
  pattern('----x-------x---').play(() => 
    midi.note(38, { velocity: 90, channel: 9 })
  )
)

const hihatTrack = track('hihat',
  pattern('x-x-x-x-x-x-x-x-').play(() => 
    midi.note(42, { velocity: 60, channel: 9 })
  )
)

// Create a simple bass line
const bassTrack = track('bass',
  pattern('x-------x-------').play((state) => {
    // Alternate between two notes
    const note = state.bar % 2 === 0 ? 36 : 38
    return midi.note(note, { velocity: 80, channel: 0 })
  })
)

// Create the song
const mySong = song.create([
  kickTrack,
  snareTrack, 
  hihatTrack,
  bassTrack
], {
  tempo: 120,
  meter: [4, 4]
})

module.exports = mySong
