// Pattern generation and matching

function pattern(str) {
  const compiled = compile(str)
  
  return {
    play: (midiFunc) => {
      return (state) => {
        const actions = []
        // Calculate position: each beat is 24 ticks, each 16th note is 6 ticks
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
  const ticksPerChar = 6 // Each char is a 16th note (6 ticks)
  const length = chars.length * ticksPerChar
  const hits = {}
  
  chars.forEach((char, i) => {
    if (char === 'x') {
      // Mark the first tick of this 16th note as a hit
      const startTick = i * ticksPerChar
      hits[startTick] = true
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
