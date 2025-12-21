// Structural helpers for organizing songs

function bars(count, track) {
  return (state) => {
    const currentBar = state.bar % count
    if (currentBar === 0 && state.beat === 0 && state.tick === 0) {
      return track(state)
    }
    return { actions: [] }
  }
}

function loop(count, track) {
  return (state) => {
    const loopPosition = state.bar % count
    return track({ ...state, bar: loopPosition })
  }
}

function every(interval, track) {
  return (state) => {
    if (state.bar % interval === 0) {
      return track(state)
    }
    return { actions: [] }
  }
}

module.exports = {
  bars,
  loop,
  every
}
