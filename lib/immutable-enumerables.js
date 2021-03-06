// lifted from https://github.com/mikeal/immutable-enumerables
// for some reason enumerables does not work using that project direct. so 4 lines here ya are

const { entries, fromEntries, defineProperties } = Object
const immen = { writable: false, enumerable: true }
const mapProps = ([key, value]) => [key, {value, ...immen }]
const lock = (obj, props) => defineProperties(obj, fromEntries(entries(props).map(mapProps)))
module.exports = { lock }
