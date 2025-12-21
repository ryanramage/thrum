/**
 * Song structure for Thrum
 * 
 * Manages tracks and provides song-level operations.
 */

const { State } = require('./state')

/**
 * Create a song from tracks
 * @param {Array} tracks - Array of track functions or track objects
 * @param {Object} options - Song options (tempo, meter)
 * @returns {Object} Song object with tick method
 */
function create(tracks, options = {}) {
  const meter = options.meter || [4, 4]
  const tempo = options.tempo || 120
  
  return {
    tracks,
    meter,
    tempo,
    
    /**
     * Execute all tracks for a given state
     * @param {State|Object} state - Current state
     * @returns {Object} Result with actions
     */
    tick: (state) => {
      // Ensure we have a State object
      if (!(state instanceof State)) {
        state = new State(state)
      }

      const actions = []
      
      // Check if any track is soloed
      const hasSolo = tracks.some(t => t.solo === true)
      
      // Execute each track
      tracks.forEach(track => {
        // Handle track objects with tick method
        if (track && typeof track.tick === 'function') {
          // Skip muted tracks
          if (track.muted) return
          
          // If any track is soloed, only play soloed tracks
          if (hasSolo && !track.solo) return
          
          const result = track.tick(state)
          if (result && result.actions) {
            actions.push(...result.actions)
          }
        }
        // Handle plain functions
        else if (typeof track === 'function') {
          const result = track(state)
          if (result && result.actions) {
            actions.push(...result.actions)
          }
        }
      })
      
      return { actions }
    },
    
    /**
     * Get a track by name
     * @param {string} name - Track name
     * @returns {Object|undefined} Track object
     */
    getTrack: (name) => {
      return tracks.find(t => t.name === name)
    },
    
    /**
     * Mute a track by name
     * @param {string} name - Track name
     * @returns {Object} This song (for chaining)
     */
    muteTrack: (name) => {
      const track = tracks.find(t => t.name === name)
      if (track && track.mute) track.mute()
      return this
    },
    
    /**
     * Unmute a track by name
     * @param {string} name - Track name
     * @returns {Object} This song (for chaining)
     */
    unmuteTrack: (name) => {
      const track = tracks.find(t => t.name === name)
      if (track && track.unmute) track.unmute()
      return this
    }
  }
}

/**
 * Create a track that changes behavior per section
 * @param {number} barsPerSection - Number of bars per section
 * @param {Function} sectionFunc - Function that receives (sectionNum, state)
 * @returns {Function} Track function
 */
function section(barsPerSection, sectionFunc) {
  return (state) => {
    // Ensure we have a State object
    if (!(state instanceof State)) {
      state = new State(state)
    }

    const sectionNum = Math.floor(state.bar / barsPerSection)
    return sectionFunc(sectionNum, state)
  }
}

module.exports = {
  create,
  section
}
