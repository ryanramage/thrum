// Song creation and management

function create(tracks, options = {}) {
  const meter = options.meter || [4, 4]
  const tempo = options.tempo || 120
  
  return {
    tracks,
    meter,
    tempo,
    tick: (state) => {
      const actions = []
      
      // Execute each track
      tracks.forEach(track => {
        if (typeof track === 'function') {
          const result = track(state)
          if (result && result.actions) {
            actions.push(...result.actions)
          }
        }
      })
      
      return { actions }
    }
  }
}

function section(bars, generator) {
  return (state) => {
    const currentBar = state.bar
    const sectionBar = Math.floor(currentBar / bars)
    return generator(sectionBar, state)
  }
}

module.exports = {
  create,
  section
}
