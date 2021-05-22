function noteStore(IPFS, OrbitDB) {
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

    async putNotes(data, mime, options = {}) {
      const {cid} = await ipfs.add(data)

      if(options.pin) await ipfs.pin.add(cid)

      return await this._addOperation({
        op: "PUTNOTES",
        key: null,
        value: {
          cid: cid.toString(),
          mime: mime
        }
      }, options)
    }

    async deleteNotes(hash, options = {}) {
      const operation = {
        op: "DELNOTES",
        key: null,
        value: hash
      }
      return this._addOperation(operation, options)
    }

    getNotes(hash) {
      const entry = this.get(hash).payload.data
      return entry
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
