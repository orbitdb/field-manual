class NewPiecePlease {
  constructor (Ipfs, OrbitDB) {
    this.Ipfs = Ipfs
    this.OrbitDB = OrbitDB
  }
}

try {
    const Ipfs = require('ipfs')
    const OrbitDB = require('orbit-db')

    module.exports = exports = new NewPiecePlease(Ipfs, OrbitDB)
} catch (e) {
    window.NPP = new NewPiecePlease(window.Ipfs, window.OrbitDB)
}
