// Pattern generation and matching

function pattern(str) {
  const compiled = compile(str)
  
  return {
    play: (midiFunc) => {
      return (state) => {
        const actions = []
        const position = state.tick + (state.beat * 24) + (state.bar * 96)
        const patternPos = position % compiled.length
        
        if (compiled.hits[patternPos]) {
          const result = midiFunc(state)
          if (result) {
            // Handle both single actions and arrays
            if (Array.isArray(result)) {
              actions.push(...result)
            } else {
              actions.push(result)
            }
          }
        }
        
        return { actions }
      }
    }
  }
}

function compile(str) {
  const chars = str.split('')
  const ticksPerChar = 24 // Each char is a 16th note (24 ticks)
  const length = chars.length * ticksPerChar
  const hits = {}
  
  chars.forEach((char, i) => {
    if (char === 'x') {
      // Mark all ticks in this 16th note as hits
      const startTick = i * ticksPerChar
      for (let tick = startTick; tick < startTick + ticksPerChar; tick++) {
        hits[tick] = true
      }
    }
  })
  
  return { length, hits }
}

function euclidean(pulses, steps) {
  // Euclidean rhythm algorithm
  const bucket = []
  
  for (let i = 0; i < steps; i++) {
    bucket.push(Math.floor((pulses * (i + 1)) / steps) - Math.floor((pulses * i) / steps))
  }
  
  return pattern(bucket.map(b => b ? 'x' : '-').join(''))
}

module.exports = {
  pattern,
  euclidean
}
