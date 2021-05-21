function noteStore(IPFS, OrbitDB) {
  class NoteStore extends OrbitDB.DocumentStore {
    constructor(ipfs, id, dbname, options) {
      super(ipfs, id, dbname, options)
      this._type = NoteStore.type
    }

    static get type () {
      return "noteStore"
    }
  }

  return NoteStore
}


try {
  const IPFS = require("ipfs")
  const OrbitDB = require("orbit-db")

  module.exports = noteStore(IPFS, OrbitDB)
} catch (e) {
  console.log(e)
  window.NoteStore = noteStore(IPFS, OrbitDB)
}
