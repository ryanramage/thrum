// Pattern generation and matching

function pattern(str, resolution = 'auto') {
  const compiled = compile(str, resolution)
  
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

function compile(str, resolution = 'auto') {
  const chars = str.split('')
  
  let ticksPerChar
  if (resolution === 'auto') {
    // Auto-detect pattern resolution based on length
    // 16 chars = 16th note resolution (6 ticks per char)
    // 4 chars or other = beat resolution (24 ticks per char)
    ticksPerChar = chars.length === 16 ? 6 : 24
  } else if (typeof resolution === 'number') {
    ticksPerChar = resolution
  } else {
    // Named resolutions
    const resolutions = {
      'whole': 96,
      'half': 48, 
      'quarter': 24,
      'eighth': 12,
      'sixteenth': 6,
      'thirtysecond': 3,
      'sixtyfourth': 1.5
    }
    ticksPerChar = resolutions[resolution] || 24
  }
  
  const length = chars.length * ticksPerChar
  const hits = {}
  
  chars.forEach((char, i) => {
    if (char === 'x') {
      // Mark the first tick of this subdivision as a hit
      const startTick = Math.floor(i * ticksPerChar)
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
