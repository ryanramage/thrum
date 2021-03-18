module.exports = function toMidi (spp, msg, context) {
  let midi = context.midi
  let output = msg.output || Object.keys(midi)[0]
  let channel = msg.channel || 0

  let port = midi[output]
  if (!port) return
  port.control(channel, msg.knob, msg.value) // request an acutal midi note
}
