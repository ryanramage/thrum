const path = require('path')
const fs = require('fs')
const chokidar = require('chokidar')

// Entry point for the new thrum architecture
// Handles hot-reloading of song files

class ThrumNext {
  constructor(options = {}) {
    this.songPath = options.songPath
    this.currentSong = null
    this.watcher = null
    this.onTick = options.onTick || (() => {})
    this.state = {
      position: 0,
      bar: 0,
      beat: 0,
      tick: 0
    }
  }

  // Load a song file
  loadSong(filepath) {
    try {
      // Clear require cache for hot reload
      delete require.cache[require.resolve(filepath)]
      this.currentSong = require(filepath)
      console.log('Song loaded:', filepath)
      return true
    } catch (err) {
      console.error('Error loading song:', err)
      return false
    }
  }

  // Start watching a song file for changes
  watch(filepath) {
    if (this.watcher) {
      this.watcher.close()
    }

    this.loadSong(filepath)

    this.watcher = chokidar.watch(filepath, {
      persistent: true,
      ignoreInitial: true
    })

    this.watcher.on('change', () => {
      console.log('Song file changed, reloading...')
      this.loadSong(filepath)
    })

    return this
  }

  // Execute one tick of the song
  tick() {
    if (!this.currentSong) {
      return { actions: [] }
    }

    const result = this.currentSong.tick(this.state)
    
    // Advance state
    this.state.tick++
    if (this.state.tick >= 24) { // Assuming 24 ticks per beat
      this.state.tick = 0
      this.state.beat++
      if (this.state.beat >= 4) { // Assuming 4/4 time
        this.state.beat = 0
        this.state.bar++
      }
    }
    this.state.position++

    this.onTick(result)
    return result
  }

  // Reset position
  reset() {
    this.state = {
      position: 0,
      bar: 0,
      beat: 0,
      tick: 0
    }
  }

  // Stop watching
  stop() {
    if (this.watcher) {
      this.watcher.close()
      this.watcher = null
    }
  }
}

module.exports = ThrumNext
