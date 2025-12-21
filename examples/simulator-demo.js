/**
 * Thrum Simulator Demo
 * 
 * This demonstrates how to use the simulator to test and visualize
 * Thrum songs without MIDI hardware.
 */

const simulator = require('../lib-next/simulator')
const song = require('../lib-next/song')
const pattern = require('../lib-next/pattern')
const midi = require('../lib-next/midi')

// Create a simple drum pattern
const kick = pattern.pattern('x---x---x---x---').play(
  midi.note('C2', { channel: 9 })
)

const snare = pattern.pattern('----x-------x---').play(
  midi.note('D2', { channel: 9 })
)

const hihat = pattern.pattern('x-x-x-x-x-x-x-x-').play(
  midi.note('F#2', { channel: 9, velocity: 80 })
)

// Create the song
const mySong = song.create([kick, snare, hihat], {
  tempo: 120,
  meter: [4, 4]
})

// Create the simulator
const sim = simulator.create(mySong)

console.log('=== Thrum Simulator Demo ===\n')

// Run for 4 bars and get results
console.log('Running simulation for 4 bars...\n')
const results = sim.run(4)

console.log(`Total events: ${results.length}\n`)

// Show first few events
console.log('First 10 events:')
results.slice(0, 10).forEach(r => {
  console.log(`  Tick ${r.tick} (Bar ${r.state.bar + 1}, Beat ${r.state.beat + 1}, Tick ${r.state.tick}):`)
  r.actions.forEach(action => {
    console.log(`    - ${action.type}: ${action.note} (channel ${action.channel}, velocity ${action.velocity})`)
  })
})

console.log('\n')

// Get timeline with timing information
const timeline = sim.timeline(2)
console.log('Timeline metadata:')
console.log(`  Tempo: ${timeline.metadata.tempo} BPM`)
console.log(`  Meter: ${timeline.metadata.meter[0]}/${timeline.metadata.meter[1]}`)
console.log(`  Duration: ${timeline.metadata.durationSeconds.toFixed(2)} seconds`)
console.log(`  Total ticks: ${timeline.metadata.totalTicks}`)

console.log('\n')

// Visualize the pattern
console.log('Pattern visualization:')
console.log(sim.visualize(4))

console.log('\n')

// Test a single tick
console.log('Testing single tick (tick 0):')
const singleTick = sim.tick(0)
console.log(`  State: Bar ${singleTick.state.bar}, Beat ${singleTick.state.beat}, Tick ${singleTick.state.tick}`)
console.log(`  Actions: ${singleTick.actions.length}`)
singleTick.actions.forEach(action => {
  console.log(`    - ${action.type}: ${action.note}`)
})
