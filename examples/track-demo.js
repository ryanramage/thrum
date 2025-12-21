/**
 * Track Abstraction Demo
 * 
 * Demonstrates named tracks, groups, and arrangements.
 */

const simulator = require('../lib-next/simulator')
const song = require('../lib-next/song')
const { track, group, arrangement } = require('../lib-next/track')
const pattern = require('../lib-next/pattern')
const midi = require('../lib-next/midi')

console.log('=== Track Abstraction Demo ===\n')

// Example 1: Named tracks
console.log('Example 1: Named Tracks')
console.log('------------------------')

const kick = track('kick',
  pattern.pattern('x---x---x---x---').play(midi.note('C2', { channel: 9 }))
)

const snare = track('snare',
  pattern.pattern('----x-------x---').play(midi.note('D2', { channel: 9 }))
)

const hihat = track('hihat',
  pattern.pattern('x-x-x-x-x-x-x-x-').play(midi.note('F#2', { channel: 9, velocity: 80 }))
)

let mySong = song.create([kick, snare, hihat], { tempo: 120 })
let sim = simulator.create(mySong)

console.log(`Tracks: ${kick.name}, ${snare.name}, ${hihat.name}`)
console.log(`Events in 2 bars: ${sim.run(2).length}\n`)

// Example 2: Track groups
console.log('Example 2: Track Groups')
console.log('-----------------------')

const drums = group('drums', [kick, snare, hihat])

const bass = track('bass',
  pattern.pattern('x---x---x---x---').play(midi.note('C2', { channel: 0 }))
)

mySong = song.create([drums, bass], { tempo: 120 })
sim = simulator.create(mySong)

console.log(`Group: ${drums.name} with ${drums.tracks.length} tracks`)
console.log(`Events in 2 bars: ${sim.run(2).length}\n`)

// Example 3: Muting tracks
console.log('Example 3: Muting Tracks')
console.log('------------------------')

drums.muteTrack('hihat')
console.log('Muted hihat')
console.log(`Events in 2 bars: ${sim.run(2).length}`)

drums.unmuteTrack('hihat')
console.log('Unmuted hihat')
console.log(`Events in 2 bars: ${sim.run(2).length}\n`)

// Example 4: Soloing tracks
console.log('Example 4: Soloing Tracks')
console.log('-------------------------')

drums.soloTrack('kick')
console.log('Soloed kick')
console.log(`Events in 2 bars: ${sim.run(2).length}`)

drums.unsoloAll()
console.log('Unsoloed all')
console.log(`Events in 2 bars: ${sim.run(2).length}\n`)

// Example 5: Arrangements
console.log('Example 5: Song Arrangements')
console.log('----------------------------')

const introTracks = [
  track('intro-kick', pattern.pattern('x-------').play(midi.note('C2', { channel: 9 })))
]

const verseTracks = [
  track('verse-kick', pattern.pattern('x---x---').play(midi.note('C2', { channel: 9 }))),
  track('verse-snare', pattern.pattern('----x---').play(midi.note('D2', { channel: 9 })))
]

const chorusTracks = [
  track('chorus-kick', pattern.pattern('x---x---x---x---').play(midi.note('C2', { channel: 9 }))),
  track('chorus-snare', pattern.pattern('----x-------x---').play(midi.note('D2', { channel: 9 }))),
  track('chorus-hihat', pattern.pattern('x-x-x-x-x-x-x-x-').play(midi.note('F#2', { channel: 9 })))
]

const arr = arrangement([
  [2, 'intro', introTracks],
  [4, 'verse', verseTracks],
  [4, 'chorus', chorusTracks]
])

mySong = song.create([arr], { tempo: 120 })
sim = simulator.create(mySong)

console.log('Song structure:')
console.log('  Bars 0-1: intro (1 track)')
console.log('  Bars 2-5: verse (2 tracks)')
console.log('  Bars 6-9: chorus (3 tracks)')
console.log(`\nTotal events in 10 bars: ${sim.run(10).length}`)

console.log('\nVisualization of first 4 bars:')
console.log(sim.visualize(4))
