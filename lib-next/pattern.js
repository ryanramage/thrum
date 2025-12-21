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
          const action = midiFunc(state)
          if (action) actions.push(action)
        }
        
        return { actions }
      }
    }
  }
}

function compile(str) {
  const chars = str.split('')
  const length = chars.length * 24 // Each char is a 16th note (24 ticks)
  const hits = {}
  
  chars.forEach((char, i) => {
    if (char === 'x') {
      hits[i * 24] = true
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
