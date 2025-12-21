/**
 * Thrum Simulator
 * 
 * Simulates MIDI clock ticks to run Thrum songs without hardware.
 * Useful for testing, debugging, and development.
 */

function create(songDefinition, options = {}) {
  const tempo = options.tempo || songDefinition.tempo || 120
  const meter = options.meter || songDefinition.meter || [4, 4]
  const ticksPerBeat = 24 // MIDI standard
  const beatsPerBar = meter[0]
  const ticksPerBar = beatsPerBar * ticksPerBeat
  
  return {
    tempo,
    meter,
    ticksPerBeat,
    beatsPerBar,
    ticksPerBar,
    song: songDefinition,
    
    /**
     * Run the song for a specified number of bars
     * @param {number} bars - Number of bars to simulate
     * @returns {Array} Array of tick results with actions
     */
    run(bars = 4) {
      const totalTicks = bars * this.ticksPerBar
      const results = []
      
      for (let absoluteTick = 0; absoluteTick < totalTicks; absoluteTick++) {
        const tick = absoluteTick % this.ticksPerBeat
        const beat = Math.floor(absoluteTick / this.ticksPerBeat) % this.beatsPerBar
        const bar = Math.floor(absoluteTick / this.ticksPerBar)
        
        const state = {
          tick,
          beat,
          bar,
          absoluteTick
        }
        
        const result = this.song.tick(state)
        
        if (result && result.actions && result.actions.length > 0) {
          results.push({
            tick: absoluteTick,
            state: { ...state },
            actions: result.actions
          })
        }
      }
      
      return results
    },
    
    /**
     * Run the song and get a timeline of all events
     * @param {number} bars - Number of bars to simulate
     * @returns {Object} Timeline with metadata and events
     */
    timeline(bars = 4) {
      const results = this.run(bars)
      const totalTicks = bars * this.ticksPerBar
      const durationMs = (totalTicks / this.ticksPerBeat) * (60000 / this.tempo)
      
      return {
        metadata: {
          tempo: this.tempo,
          meter: this.meter,
          bars,
          totalTicks,
          durationMs,
          durationSeconds: durationMs / 1000
        },
        events: results.map(r => ({
          ...r,
          timeMs: (r.tick / this.ticksPerBeat) * (60000 / this.tempo),
          position: `${r.state.bar + 1}.${r.state.beat + 1}.${r.state.tick}`
        }))
      }
    },
    
    /**
     * Run a single tick and return the result
     * @param {number} absoluteTick - The absolute tick number
     * @returns {Object} Result with state and actions
     */
    tick(absoluteTick) {
      const tick = absoluteTick % this.ticksPerBeat
      const beat = Math.floor(absoluteTick / this.ticksPerBeat) % this.beatsPerBar
      const bar = Math.floor(absoluteTick / this.ticksPerBar)
      
      const state = {
        tick,
        beat,
        bar,
        absoluteTick
      }
      
      const result = this.song.tick(state)
      
      return {
        state,
        actions: result?.actions || []
      }
    },
    
    /**
     * Get a visual representation of the pattern
     * @param {number} bars - Number of bars to visualize
     * @returns {string} ASCII visualization
     */
    visualize(bars = 4) {
      const results = this.run(bars)
      const totalTicks = bars * this.ticksPerBar
      const lines = []
      
      // Header
      lines.push(`Tempo: ${this.tempo} BPM | Meter: ${this.meter[0]}/${this.meter[1]} | Bars: ${bars}`)
      lines.push('─'.repeat(80))
      
      // Create a map of ticks to actions
      const tickMap = new Map()
      results.forEach(r => {
        tickMap.set(r.tick, r.actions)
      })
      
      // Build visualization
      for (let bar = 0; bar < bars; bar++) {
        const barStart = bar * this.ticksPerBar
        let barLine = `Bar ${bar + 1}: `
        
        for (let beat = 0; beat < this.beatsPerBar; beat++) {
          const beatStart = barStart + (beat * this.ticksPerBeat)
          barLine += '|'
          
          for (let tick = 0; tick < this.ticksPerBeat; tick++) {
            const absoluteTick = beatStart + tick
            if (tickMap.has(absoluteTick)) {
              const actions = tickMap.get(absoluteTick)
              // Use different symbols for different action types
              if (actions.some(a => a.type === 'note')) {
                barLine += 'x'
              } else if (actions.some(a => a.type === 'cc')) {
                barLine += 'c'
              } else {
                barLine += '•'
              }
            } else {
              barLine += tick % 6 === 0 ? '·' : ' '
            }
          }
        }
        barLine += '|'
        lines.push(barLine)
      }
      
      lines.push('─'.repeat(80))
      lines.push(`Total events: ${results.length}`)
      
      return lines.join('\n')
    }
  }
}

module.exports = {
  create
}
