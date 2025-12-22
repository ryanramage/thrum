#!/usr/bin/env node

/**
 * Thrum Simulator CLI
 * 
 * Command-line tool to simulate Thrum songs and visualize their output.
 * 
 * Usage:
 *   node bin/simulator.js <music-file> [options]
 *   
 * Options:
 *   --bars <number>     Number of bars to simulate (default: 4)
 *   --tempo <number>    Override tempo (default: from song)
 *   --format <format>   Output format: events|timeline|visual (default: events)
 *   --help              Show this help
 */

const fs = require('fs')
const path = require('path')
const simulator = require('../lib/simulator')

function usage() {
  console.log(`
Thrum Simulator CLI

Usage:
  node bin/simulator.js <music-file> [options]

Options:
  --bars <number>     Number of bars to simulate (default: 4)
  --tempo <number>    Override tempo (default: from song)
  --format <format>   Output format: events|timeline|visual (default: events)
  --help              Show this help

Examples:
  node bin/simulator.js songs/my-song.js
  node bin/simulator.js songs/my-song.js --bars 8 --format visual
  node bin/simulator.js songs/my-song.js --tempo 140 --format timeline
`)
}

function parseArgs(args) {
  const options = {
    bars: 4,
    format: 'events'
  }
  
  let musicFile = null
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    
    if (arg === '--help' || arg === '-h') {
      usage()
      process.exit(0)
    } else if (arg === '--bars') {
      options.bars = parseInt(args[++i])
      if (isNaN(options.bars) || options.bars <= 0) {
        console.error('Error: --bars must be a positive number')
        process.exit(1)
      }
    } else if (arg === '--tempo') {
      options.tempo = parseInt(args[++i])
      if (isNaN(options.tempo) || options.tempo <= 0) {
        console.error('Error: --tempo must be a positive number')
        process.exit(1)
      }
    } else if (arg === '--format') {
      options.format = args[++i]
      if (!['events', 'timeline', 'visual'].includes(options.format)) {
        console.error('Error: --format must be one of: events, timeline, visual')
        process.exit(1)
      }
    } else if (!arg.startsWith('--')) {
      if (musicFile) {
        console.error('Error: Multiple music files specified')
        process.exit(1)
      }
      musicFile = arg
    } else {
      console.error(`Error: Unknown option ${arg}`)
      process.exit(1)
    }
  }
  
  if (!musicFile) {
    console.error('Error: No music file specified')
    usage()
    process.exit(1)
  }
  
  return { musicFile, options }
}

function loadMusicFile(filePath) {
  try {
    // Resolve the path
    const resolvedPath = path.resolve(filePath)
    
    // Check if file exists
    if (!fs.existsSync(resolvedPath)) {
      console.error(`Error: File not found: ${filePath}`)
      process.exit(1)
    }
    
    // Clear require cache to ensure fresh load
    delete require.cache[resolvedPath]
    
    // Load the module
    const musicModule = require(resolvedPath)
    
    // The module should export a song object or a function that returns one
    if (typeof musicModule === 'function') {
      return musicModule()
    } else if (musicModule && typeof musicModule.tick === 'function') {
      return musicModule
    } else {
      console.error('Error: Music file must export a song object or function that returns one')
      process.exit(1)
    }
  } catch (error) {
    console.error(`Error loading music file: ${error.message}`)
    process.exit(1)
  }
}

function formatEvents(results) {
  if (results.length === 0) {
    return 'No events generated'
  }
  
  const lines = []
  lines.push(`Total events: ${results.length}`)
  lines.push('─'.repeat(80))
  
  results.forEach((result, i) => {
    const pos = `${result.state.bar + 1}.${result.state.beat + 1}.${result.state.tick}`
    lines.push(`Event ${i + 1}: Tick ${result.tick} (${pos})`)
    
    result.actions.forEach((action, j) => {
      const actionStr = JSON.stringify(action, null, 2)
        .split('\n')
        .map(line => `  ${line}`)
        .join('\n')
      lines.push(actionStr)
    })
    
    if (i < results.length - 1) {
      lines.push('')
    }
  })
  
  return lines.join('\n')
}

function formatTimeline(timeline) {
  const lines = []
  
  // Metadata
  lines.push('Timeline Metadata:')
  lines.push(`  Tempo: ${timeline.metadata.tempo} BPM`)
  lines.push(`  Meter: ${timeline.metadata.meter[0]}/${timeline.metadata.meter[1]}`)
  lines.push(`  Bars: ${timeline.metadata.bars}`)
  lines.push(`  Duration: ${timeline.metadata.durationSeconds.toFixed(2)}s`)
  lines.push(`  Total Events: ${timeline.events.length}`)
  lines.push('─'.repeat(80))
  
  if (timeline.events.length === 0) {
    lines.push('No events generated')
    return lines.join('\n')
  }
  
  // Events
  timeline.events.forEach((event, i) => {
    const timeStr = `${(event.timeMs / 1000).toFixed(3)}s`
    lines.push(`${timeStr.padStart(8)} | ${event.position.padStart(6)} | Tick ${event.tick}`)
    
    event.actions.forEach(action => {
      const actionStr = JSON.stringify(action)
      lines.push(`${' '.repeat(8)} | ${' '.repeat(6)} | ${actionStr}`)
    })
    
    if (i < timeline.events.length - 1) {
      lines.push('')
    }
  })
  
  return lines.join('\n')
}

function main() {
  const args = process.argv.slice(2)
  
  if (args.length === 0) {
    usage()
    process.exit(1)
  }
  
  const { musicFile, options } = parseArgs(args)
  
  console.log(`Loading music file: ${musicFile}`)
  const song = loadMusicFile(musicFile)
  
  console.log(`Creating simulator...`)
  const sim = simulator.create(song, options)
  
  console.log(`Running simulation for ${options.bars} bars...`)
  console.log('─'.repeat(80))
  
  if (options.format === 'events') {
    const results = sim.run(options.bars)
    console.log(formatEvents(results))
  } else if (options.format === 'timeline') {
    const timeline = sim.timeline(options.bars)
    console.log(formatTimeline(timeline))
  } else if (options.format === 'visual') {
    const visualization = sim.visualize(options.bars)
    console.log(visualization)
  }
}

if (require.main === module) {
  main()
}

module.exports = { main, parseArgs, loadMusicFile, formatEvents, formatTimeline }
