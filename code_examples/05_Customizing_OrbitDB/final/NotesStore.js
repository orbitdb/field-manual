function notesStore(IPFS, OrbitDB, NotesIndex) {
  class NoteStore extends OrbitDB.EventStore {
    constructor(ipfs, id, dbname, options) {
      if(!options.Index) Object.assign(options, { Index: NotesIndex })

      super(ipfs, id, dbname, options)
      this._type = NoteStore.type
      this._ipfs = ipfs
    }

    static get type () {
      return "noteStore"
    }

    getNotes(cid) {
      return this._index.getNotes(cid)
    }

    getComments(cid, flat = true) {
      return this._index.getComments(cid, flat = flat)
    }
  }

  return NoteStore
}


try {
  const IPFS = require("ipfs")
  const OrbitDB = require("orbit-db")
  const NotesIndex = require("./NotesIndex")

  module.exports = notesStore(IPFS, OrbitDB)
} catch (e) {
  console.log(e)
  window.NoteStore = notesStore(window.Ipfs, window.OrbitDB, window.NotesIndex)
}
