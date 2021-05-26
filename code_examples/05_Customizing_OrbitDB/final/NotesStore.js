function notesStore(IPFS, OrbitDB, NotesIndex) {
  class NoteStore extends OrbitDB.EventStore {
    constructor(ipfs, id, dbname, options) {
      if(!options.Index) options = Object.assign(options, { Index: NotesIndex })
      console.log(options.Index)

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

    addNotesByCID(cid, mime, instrument = "piano", options = {}) {
      return this._addOperation({
        op: "ADDNOTES",
        key: null,
        value: {
          cid: cid,
          mime: mime,
          instrument: instrument
        }
      }, options)
    }

    async addNotesBinary(binary, mime, instrument = "piano", options = {}) {
      let {cid} = await this._ipfs.add(binary)

      if(options.pin) await this._ipfs.pin.add(cid)

      return await this.addNotesByCID(cid.toString(), mime, instrument = instrument, options = options)
    }

    addComment(text, reference) {
      if(this._index.getNotes(reference) !== undefined || this._index._comments[reference] !== undefined) {
         return this._addOperation({
           op: "ADDCOMMENT",
           key: reference,
           value: text
         })
      } else {
        return null
      }
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
