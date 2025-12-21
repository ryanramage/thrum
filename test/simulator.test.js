const test = require('tape')
const simulator = require('../lib/simulator')
const song = require('../lib/song')
const pattern = require('../lib/pattern')
const midi = require('../lib/midi')

test('simulator.create - creates a simulator with defaults', t => {
  const s = song.create([], { tempo: 120, meter: [4, 4] })
  const sim = simulator.create(s)
  
  t.equal(sim.tempo, 120, 'tempo is 120')
  t.deepEqual(sim.meter, [4, 4], 'meter is 4/4')
  t.equal(sim.ticksPerBeat, 24, 'ticks per beat is 24')
  t.equal(sim.beatsPerBar, 4, 'beats per bar is 4')
  t.equal(sim.ticksPerBar, 96, 'ticks per bar is 96')
  t.end()
})

test('simulator.run - runs empty song', t => {
  const s = song.create([])
  const sim = simulator.create(s)
  const results = sim.run(1)
  
  t.ok(Array.isArray(results), 'returns an array')
  t.equal(results.length, 0, 'no results for empty song')
  t.end()
})

test('simulator.run - runs song with pattern', t => {
  const track = pattern.pattern('x---').play(midi.note('C4'))
  const s = song.create([track])
  const sim = simulator.create(s)
  const results = sim.run(1)
  
  t.ok(results.length > 0, 'has results')
  t.equal(results[0].tick, 0, 'first event at tick 0')
  t.ok(results[0].state, 'has state')
  t.equal(results[0].state.bar, 0, 'first event in bar 0')
  t.equal(results[0].state.beat, 0, 'first event in beat 0')
  t.equal(results[0].state.tick, 0, 'first event in tick 0')
  t.ok(Array.isArray(results[0].actions), 'has actions array')
  t.end()
})

test('simulator.run - runs multiple bars', t => {
  const track = pattern.pattern('x---').play(midi.note('C4'))
  const s = song.create([track])
  const sim = simulator.create(s)
  const results = sim.run(4)
  
  // Should have 4 hits (one per bar)
  t.equal(results.length, 4, 'has 4 events for 4 bars')
  
  // Check bar numbers
  t.equal(results[0].state.bar, 0, 'first event in bar 0')
  t.equal(results[1].state.bar, 1, 'second event in bar 1')
  t.equal(results[2].state.bar, 2, 'third event in bar 2')
  t.equal(results[3].state.bar, 3, 'fourth event in bar 3')
  t.end()
})

test('simulator.tick - runs single tick', t => {
  const track = pattern.pattern('x---').play(midi.note('C4'))
  const s = song.create([track])
  const sim = simulator.create(s)
  
  const result = sim.tick(0)
  
  t.ok(result.state, 'has state')
  t.equal(result.state.tick, 0, 'tick is 0')
  t.equal(result.state.beat, 0, 'beat is 0')
  t.equal(result.state.bar, 0, 'bar is 0')
  t.ok(Array.isArray(result.actions), 'has actions array')
  t.ok(result.actions.length > 0, 'has actions')
  t.end()
})

test('simulator.tick - calculates state correctly', t => {
  const s = song.create([])
  const sim = simulator.create(s)
  
  // Tick 0: bar 0, beat 0, tick 0
  let result = sim.tick(0)
  t.equal(result.state.bar, 0, 'tick 0: bar 0')
  t.equal(result.state.beat, 0, 'tick 0: beat 0')
  t.equal(result.state.tick, 0, 'tick 0: tick 0')
  
  // Tick 24: bar 0, beat 1, tick 0
  result = sim.tick(24)
  t.equal(result.state.bar, 0, 'tick 24: bar 0')
  t.equal(result.state.beat, 1, 'tick 24: beat 1')
  t.equal(result.state.tick, 0, 'tick 24: tick 0')
  
  // Tick 96: bar 1, beat 0, tick 0
  result = sim.tick(96)
  t.equal(result.state.bar, 1, 'tick 96: bar 1')
  t.equal(result.state.beat, 0, 'tick 96: beat 0')
  t.equal(result.state.tick, 0, 'tick 96: tick 0')
  
  t.end()
})

test('simulator.timeline - generates timeline with metadata', t => {
  const track = pattern.pattern('x---').play(midi.note('C4'))
  const s = song.create([track], { tempo: 120 })
  const sim = simulator.create(s)
  const timeline = sim.timeline(2)
  
  t.ok(timeline.metadata, 'has metadata')
  t.equal(timeline.metadata.tempo, 120, 'metadata has tempo')
  t.deepEqual(timeline.metadata.meter, [4, 4], 'metadata has meter')
  t.equal(timeline.metadata.bars, 2, 'metadata has bars')
  t.equal(timeline.metadata.totalTicks, 192, 'metadata has total ticks')
  t.ok(timeline.metadata.durationMs > 0, 'metadata has duration in ms')
  t.ok(timeline.metadata.durationSeconds > 0, 'metadata has duration in seconds')
  
  t.ok(Array.isArray(timeline.events), 'has events array')
  t.ok(timeline.events.length > 0, 'has events')
  
  const firstEvent = timeline.events[0]
  t.ok(firstEvent.timeMs !== undefined, 'event has timeMs')
  t.ok(firstEvent.position, 'event has position string')
  t.equal(firstEvent.position, '1.1.0', 'first event position is 1.1.0')
  
  t.end()
})

test('simulator.visualize - generates ASCII visualization', t => {
  const track = pattern.pattern('x---').play(midi.note('C4'))
  const s = song.create([track], { tempo: 120 })
  const sim = simulator.create(s)
  const viz = sim.visualize(2)
  
  t.ok(typeof viz === 'string', 'returns a string')
  t.ok(viz.includes('Tempo: 120'), 'includes tempo')
  t.ok(viz.includes('Meter: 4/4'), 'includes meter')
  t.ok(viz.includes('Bar 1:'), 'includes bar 1')
  t.ok(viz.includes('Bar 2:'), 'includes bar 2')
  t.ok(viz.includes('Total events:'), 'includes total events')
  t.end()
})

test('simulator - works with 16th note patterns', t => {
  const track = pattern.pattern('x-x-x-x-x-x-x-x-').play(midi.note('C4'))
  const s = song.create([track])
  const sim = simulator.create(s)
  const results = sim.run(1)
  
  // 16 character pattern with 8 hits
  t.equal(results.length, 8, 'has 8 events for 16th note pattern')
  
  // Check spacing (should be every 6 ticks for 16th notes)
  t.equal(results[0].tick, 0, 'first hit at tick 0')
  t.equal(results[1].tick, 12, 'second hit at tick 12')
  t.equal(results[2].tick, 24, 'third hit at tick 24')
  
  t.end()
})

test('simulator - works with multiple tracks', t => {
  const track1 = pattern.pattern('x---').play(midi.note('C4'))
  const track2 = pattern.pattern('-x--').play(midi.note('E4'))
  const s = song.create([track1, track2])
  const sim = simulator.create(s)
  const results = sim.run(1)
  
  t.equal(results.length, 2, 'has 2 events (one per track per bar)')
  
  // First event should be from track1 at tick 0
  t.equal(results[0].tick, 0, 'first event at tick 0')
  
  // Second event should be from track2 at tick 24 (second beat)
  t.equal(results[1].tick, 24, 'second event at tick 24')
  
  t.end()
})
