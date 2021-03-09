module.exports = function toMidi (spp, msg, context) {
  let midi = context.midi
  let output = msg.output || Object.keys(midi)[0]
  let channel = msg.channel || 0

  let port = midi[output]
  if (!port) return
  let velocity = msg.velocity || 127
  let length = msg.length || lengths['8n']
  if (typeof length === 'string') length = lengths[length]
  if (length < 1) length = 1
  port.noteOn(channel, msg.note, velocity) // request an acutal midi note
  let offSpp = spp + length
  return {spp: offSpp, name: 'midiOff', msg} // schedule a midi off note
}
