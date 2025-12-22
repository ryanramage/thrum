// test-debug.js
const { song, track, chordProgression } = require('./index')

const chords = {
  Cmaj9: [36, 52, 55, 59, 62, 71],
  Am11: [33, 48, 52, 55, 59, 62],
}

const testChords = track('test-chords',
  chordProgression(
    [chords.Cmaj9, chords.Am11],
    {
      barsPerChord: 4,
      velocity: 40,
      length: 384,
      channel: 0,
      spread: 48
    }
  )
)

module.exports = song.create([testChords], { tempo: 60, meter: [4, 4] })
