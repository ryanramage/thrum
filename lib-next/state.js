/**
 * State management for Thrum
 * 
 * Provides a clean, immutable state object with helper methods
 * for working with musical time.
 */

class State {
  constructor({ bar = 0, beat = 0, tick = 0, absoluteTick = 0, userState = {} }) {
    // Make properties read-only
    Object.defineProperties(this, {
      bar: { value: bar, enumerable: true },
      beat: { value: beat, enumerable: true },
      tick: { value: tick, enumerable: true },
      absoluteTick: { value: absoluteTick, enumerable: true },
      userState: { value: userState, enumerable: true }
    })
  }

  /**
   * Check if this is the first tick of a beat
   * @returns {boolean}
   */
  isFirstTickOfBeat() {
    return this.tick === 0
  }

  /**
   * Check if this is the first beat of a bar
   * @returns {boolean}
   */
  isFirstBeatOfBar() {
    return this.beat === 0 && this.tick === 0
  }

  /**
   * Check if this is a specific beat in the bar (0-indexed)
   * @param {number} beatNum - Beat number (0-3 for 4/4 time)
   * @returns {boolean}
   */
  isBeat(beatNum) {
    return this.beat === beatNum && this.tick === 0
  }

  /**
   * Check if this is a specific bar (0-indexed)
   * @param {number} barNum - Bar number
   * @returns {boolean}
   */
  isBar(barNum) {
    return this.bar === barNum && this.beat === 0 && this.tick === 0
  }

  /**
   * Get the position within the current bar (0-95 for 4/4 time)
   * @returns {number}
   */
  positionInBar() {
    return this.tick + (this.beat * 24)
  }

  /**
   * Get a human-readable position string (e.g., "1.1.0" for bar 1, beat 1, tick 0)
   * @returns {string}
   */
  position() {
    return `${this.bar + 1}.${this.beat + 1}.${this.tick}`
  }

  /**
   * Check if we're at a specific position in the bar
   * @param {number} position - Position in ticks (0-95 for 4/4)
   * @returns {boolean}
   */
  isPosition(position) {
    return this.positionInBar() === position
  }

  /**
   * Check if we're at any of the given positions
   * @param {number[]} positions - Array of positions in ticks
   * @returns {boolean}
   */
  isAnyPosition(positions) {
    const pos = this.positionInBar()
    return positions.includes(pos)
  }

  /**
   * Create a new state with updated user state
   * @param {Object} updates - Updates to merge into userState
   * @returns {State}
   */
  withUserState(updates) {
    return new State({
      bar: this.bar,
      beat: this.beat,
      tick: this.tick,
      absoluteTick: this.absoluteTick,
      userState: { ...this.userState, ...updates }
    })
  }

  /**
   * Get a value from user state
   * @param {string} key - Key to get
   * @param {*} defaultValue - Default value if key doesn't exist
   * @returns {*}
   */
  get(key, defaultValue = undefined) {
    return this.userState[key] !== undefined ? this.userState[key] : defaultValue
  }

  /**
   * Create a state from simple tick count
   * @param {number} absoluteTick - Absolute tick number
   * @param {Object} options - Options (userState, etc.)
   * @returns {State}
   */
  static fromTick(absoluteTick, options = {}) {
    const tick = absoluteTick % 24
    const beat = Math.floor(absoluteTick / 24) % 4
    const bar = Math.floor(absoluteTick / 96)
    
    return new State({
      bar,
      beat,
      tick,
      absoluteTick,
      userState: options.userState || {}
    })
  }

  /**
   * Create a state from bar, beat, tick
   * @param {number} bar - Bar number
   * @param {number} beat - Beat number
   * @param {number} tick - Tick number
   * @param {Object} options - Options (userState, etc.)
   * @returns {State}
   */
  static from(bar, beat, tick, options = {}) {
    const absoluteTick = (bar * 96) + (beat * 24) + tick
    
    return new State({
      bar,
      beat,
      tick,
      absoluteTick,
      userState: options.userState || {}
    })
  }

  /**
   * Convert to plain object
   * @returns {Object}
   */
  toObject() {
    return {
      bar: this.bar,
      beat: this.beat,
      tick: this.tick,
      absoluteTick: this.absoluteTick,
      userState: this.userState
    }
  }
}

module.exports = {
  State
}
