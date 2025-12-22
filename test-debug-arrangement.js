// test-debug-arrangement.js
const { song, track, chordProgression, arrangement } = require('./index')

const chords = {
  Cmaj9: [36, 52, 55, 59, 62, 71],
  Am11: [33, 48, 52, 55, 59, 62],
}

const section1Chords = track('section1-chords',
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

const section2Chords = track('section2-chords',
  chordProgression(
    [chords.Am11, chords.Cmaj9],
    {
      barsPerChord: 4,
      velocity: 50,
      length: 384,
      channel: 0,
      spread: 36
    }
  )
)

const composition = arrangement([
  [8, 'section1', [section1Chords]],
  [8, 'section2', [section2Chords]]
])

module.exports = song.create([
  track('composition', composition)
], {
  tempo: 60,
  meter: [4, 4]
})
