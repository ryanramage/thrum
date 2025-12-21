// Pattern generation and matching

function pattern(str) {
  const compiled = compile(str)
  
  return {
    play: (midiFunc) => {
      return (state) => {
        const actions = []
        // Calculate position: each beat is 24 ticks
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
  
  // Auto-detect pattern resolution based on length
  // 16 chars = 16th note resolution (6 ticks per char)
  // 4 chars or other = beat resolution (24 ticks per char)
  const ticksPerChar = chars.length === 16 ? 6 : 24
  const length = chars.length * ticksPerChar
  const hits = {}
  
  chars.forEach((char, i) => {
    if (char === 'x') {
      // Mark the first tick of this subdivision as a hit
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
