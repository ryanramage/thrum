const { lock } = require('../lib/immutable-enumerables')

class SongState {
  constructor ({ spp, userState, actions }) {
    lock(this, { spp, userState, actions })
  }
  static set (state) { return new SongState(state) }
}

module.exports = SongState
