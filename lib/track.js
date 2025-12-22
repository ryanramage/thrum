/**
 * Track abstraction for Thrum
 * 
 * Provides named tracks, track groups, and better song organization.
 */

const { State } = require('./state')

/**
 * Create a named track
 * @param {string} name - Track name
 * @param {Function} trackFunc - Track function that receives state
 * @param {Object} options - Track options (muted, solo, etc.)
 * @returns {Object} Track object
 */
function track(name, trackFunc, options = {}) {
  const muted = options.muted || false
  const solo = options.solo || false
  const channel = options.channel
  
  const trackObj = {
    name,
    muted,
    solo,
    channel,
    
    /**
     * Execute the track
     * @param {State} state - Current state
     * @returns {Object} Result with actions
     */
    tick: (state) => {
      // Ensure we have a State object
      if (!(state instanceof State)) {
        state = new State(state)
      }
      
      // Don't execute if muted
      if (trackObj.muted) {
        return { actions: [] }
      }
      
      const result = trackFunc(state)
      
      // Apply channel override if specified
      if (trackObj.channel !== undefined && result && result.actions) {
        result.actions = result.actions.map(action => ({
          ...action,
          channel: trackObj.channel
        }))
      }
      
      return result || { actions: [] }
    },
    
    /**
     * Mute this track
     * @returns {Object} This track (for chaining)
     */
    mute: () => {
      trackObj.muted = true
      return trackObj
    },
    
    /**
     * Unmute this track
     * @returns {Object} This track (for chaining)
     */
    unmute: () => {
      trackObj.muted = false
      return trackObj
    },
    
    /**
     * Toggle mute state
     * @returns {Object} This track (for chaining)
     */
    toggleMute: () => {
      trackObj.muted = !trackObj.muted
      return trackObj
    },
    
    /**
     * Set solo state
     * @param {boolean} value - Solo state
     * @returns {Object} This track (for chaining)
     */
    setSolo: (value) => {
      trackObj.solo = value
      return trackObj
    },
    
    /**
     * Set channel for all actions
     * @param {number} ch - MIDI channel
     * @returns {Object} This track (for chaining)
     */
    setChannel: (ch) => {
      trackObj.channel = ch
      return trackObj
    }
  }
  
  return trackObj
}

/**
 * Create a track group (bus)
 * @param {string} name - Group name
 * @param {Array} tracks - Array of tracks
 * @param {Object} options - Group options
 * @returns {Object} Track group object
 */
function group(name, tracks, options = {}) {
  const muted = options.muted || false
  const solo = options.solo || false
  
  const groupObj = {
    name,
    tracks,
    muted,
    solo,
    isGroup: true,
    
    /**
     * Execute all tracks in the group
     * @param {State} state - Current state
     * @returns {Object} Result with actions from all tracks
     */
    tick: (state) => {
      // Ensure we have a State object
      if (!(state instanceof State)) {
        state = new State(state)
      }
      
      // Don't execute if group is muted
      if (groupObj.muted) {
        return { actions: [] }
      }
      
      const actions = []
      
      // Check if any track is soloed
      const hasSolo = groupObj.tracks.some(t => t.solo)
      
      groupObj.tracks.forEach(t => {
        // Skip muted tracks
        if (t.muted) return
        
        // If any track is soloed, only play soloed tracks
        if (hasSolo && !t.solo) return
        
        const result = t.tick(state)
        if (result && result.actions) {
          actions.push(...result.actions)
        }
      })
      
      return { actions }
    },
    
    /**
     * Mute this group
     * @returns {Object} This group (for chaining)
     */
    mute: () => {
      groupObj.muted = true
      return groupObj
    },
    
    /**
     * Unmute this group
     * @returns {Object} This group (for chaining)
     */
    unmute: () => {
      groupObj.muted = false
      return groupObj
    },
    
    /**
     * Toggle mute state
     * @returns {Object} This group (for chaining)
     */
    toggleMute: () => {
      groupObj.muted = !groupObj.muted
      return groupObj
    },
    
    /**
     * Get a track by name
     * @param {string} trackName - Track name
     * @returns {Object|undefined} Track object
     */
    getTrack: (trackName) => {
      return groupObj.tracks.find(t => t.name === trackName)
    },
    
    /**
     * Mute a track by name
     * @param {string} trackName - Track name
     * @returns {Object} This group (for chaining)
     */
    muteTrack: (trackName) => {
      const t = groupObj.getTrack(trackName)
      if (t) t.mute()
      return groupObj
    },
    
    /**
     * Unmute a track by name
     * @param {string} trackName - Track name
     * @returns {Object} This group (for chaining)
     */
    unmuteTrack: (trackName) => {
      const t = groupObj.getTrack(trackName)
      if (t) t.unmute()
      return groupObj
    },
    
    /**
     * Solo a track by name
     * @param {string} trackName - Track name
     * @returns {Object} This group (for chaining)
     */
    soloTrack: (trackName) => {
      const t = groupObj.getTrack(trackName)
      if (t) t.setSolo(true)
      return groupObj
    },
    
    /**
     * Unsolo all tracks
     * @returns {Object} This group (for chaining)
     */
    unsoloAll: () => {
      groupObj.tracks.forEach(t => t.setSolo(false))
      return groupObj
    }
  }
  
  return groupObj
}

/**
 * Create a section-based arrangement
 * @param {Array} sections - Array of [bars, name, tracks] tuples
 * @returns {Function} Track function
 */
function arrangement(sections) {
  let lastLoggedSection = null
  
  return (state) => {
    // Ensure we have a State object
    if (!(state instanceof State)) {
      state = new State(state)
    }
    
    // Calculate which section we're in
    let currentBar = state.bar
    let sectionStart = 0
    
    for (const [bars, name, tracks] of sections) {
      if (currentBar < sectionStart + bars) {
        // We're in this section
        const sectionBar = currentBar - sectionStart
        
        // Log section change at the start of each section
        if (sectionBar === 0 && state.beat === 0 && state.tick === 0 && lastLoggedSection !== name) {
          const trackList = Array.isArray(tracks) ? tracks : [tracks]
          const trackNames = trackList.map(track => {
            if (track && track.name) return track.name
            if (typeof track === 'function' && track.name) return track.name
            return 'unnamed'
          }).join(', ')
          
          console.log(`♪ Section: ${name} | Tracks: ${trackNames}`)
          lastLoggedSection = name
        }
        
        const sectionState = new State({
          bar: sectionBar,
          beat: state.beat,
          tick: state.tick,
          absoluteTick: state.absoluteTick,
          userState: {
            ...state.userState,
            section: name,
            sectionBar,
            absoluteBar: currentBar
          }
        })
        
        // Execute tracks for this section
        const actions = []
        const trackList = Array.isArray(tracks) ? tracks : [tracks]
        
        trackList.forEach(track => {
          if (typeof track === 'function') {
            const result = track(sectionState)
            if (result && result.actions) {
              actions.push(...result.actions)
            }
          } else if (track && typeof track.tick === 'function') {
            const result = track.tick(sectionState)
            if (result && result.actions) {
              actions.push(...result.actions)
            }
          }
        })
        
        return { actions }
      }
      
      sectionStart += bars
    }
    
    // Past all sections, return empty
    return { actions: [] }
  }
}

module.exports = {
  track,
  group,
  arrangement
}
