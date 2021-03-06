/**
 * Time can be described in a number of ways. Read more [Time](https://github.com/Tonejs/Tone.js/wiki/Time).
 * * Numbers, which will be taken literally as the time (in seconds).
 * * Notation, ("4n", "8t") describes time in BPM and time signature relative values.
 * * TransportTime, ("4:3:2") will also provide tempo and time signature relative times in the form BARS:QUARTERS:SIXTEENTHS.
 * * Frequency, ("8hz") is converted to the length of the cycle in seconds.
 * * Now-Relative, ("+1") prefix any of the above with "+" and it will be interpreted as "the current time plus whatever expression follows".
 * * Object, ({"4n" : 3, "8t" : -1}). The resulting time is equal to the sum of all of the keys multiplied by the values in the object.
 * * No Argument, for methods which accept time, no argument will be interpreted as "now" (i.e. the currentTime).
 * @category Unit
 */

 module.exports = (value) => {

 }
