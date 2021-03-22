const Tonal = require('@tonaljs/tonal')

module.exports = (name) => {
  let chord = Tonal.Chord.get(name)
  if (chord.empty) return { chord, allNotes: [], octave: () => [] }

  let allNotes = []
  for (let i=1;i<9;i++) {
    chord.notes.forEach(n => allNotes.push(`${n}${i}`))
  }

  return {
    chord,
    allNotes,
    octave: (octave, inversion, size) => {
      if (!inversion) inversion = 0
      if (!size) size = chord.notes.length
      let rootNote = `${chord.notes[inversion]}${octave}`
      let start = allNotes.findIndex(e => e === rootNote)
      return allNotes.slice(start, start+size)
    }
  }
}
