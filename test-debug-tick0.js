// test-debug-tick0.js - Debug why notes don't trigger at tick 0
const { song, track, chordProgression } = require('./index')

const chords = {
  Cmaj9: [36, 52, 55, 59, 62, 71],
  Am11: [33, 48, 52, 55, 59, 62],
}

const testChords = track('test-chords',
  (state) => {
    const ticksPerBar = 96
    const barsPerChord = 4
    
    const absoluteBar = Math.floor(state.absoluteTick / ticksPerBar)
    const chordIndex = Math.floor(absoluteBar / barsPerChord) % 2
    const barInChordSection = absoluteBar % barsPerChord
    
    const isFirstBarOfChordSection = barInChordSection === 0
    const isFirstTick = state.beat === 0 && state.tick === 0
    
    // Log at tick 0
    if (state.absoluteTick === 0) {
      console.log('=== TICK 0 DEBUG ===')
      console.log('state.absoluteTick:', state.absoluteTick)
      console.log('state.bar:', state.bar)
      console.log('state.beat:', state.beat)
      console.log('state.tick:', state.tick)
      console.log('absoluteBar:', absoluteBar)
      console.log('chordIndex:', chordIndex)
      console.log('barInChordSection:', barInChordSection)
      console.log('isFirstBarOfChordSection:', isFirstBarOfChordSection)
      console.log('isFirstTick:', isFirstTick)
      console.log('Should trigger:', isFirstBarOfChordSection && isFirstTick)
      console.log('==================')
    }
    
    if (isFirstBarOfChordSection && isFirstTick) {
      const chordToPlay = chordIndex === 0 ? chords.Cmaj9 : chords.Am11
      console.log(`Triggering chord at absoluteTick ${state.absoluteTick}, chordIndex ${chordIndex}`)
      
      return {
        actions: chordToPlay.map((note, i) => ({
          type: 'note',
          note: note,
          velocity: 40,
          length: 384,
          channel: 0,
          delay: i * 48
        }))
      }
    }
    
    return { actions: [] }
  }
)

module.exports = song.create([testChords], { tempo: 60, meter: [4, 4] })
