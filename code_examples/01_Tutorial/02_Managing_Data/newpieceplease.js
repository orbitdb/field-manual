class NewPiecePlease {
  constructor (Ipfs, OrbitDB) {
    this.OrbitDB = OrbitDB
    this.Ipfs = Ipfs
  }

  async create() {
    this.node = await this.Ipfs.create({
      preload: { enabled: false },
      repo: './ipfs',
      EXPERIMENTAL: { pubsub: true },
      config: {
        Bootstrap: [],
        Addresses: { Swarm: [] }
      }
    })

    this._init()
  }

  async _init () {
    this.orbitdb = await this.OrbitDB.createInstance(this.node)
    this.defaultOptions = { accessController: {
      write: [this.orbitdb.identity.id]
      }
    }

    const docStoreOptions = {
      ...this.defaultOptions,
      indexBy: 'hash',
    }
    this.pieces = await this.orbitdb.docstore('pieces', docStoreOptions)
    await this.pieces.load()
    this.onready()
  }

  async addNewPiece(hash, instrument = "Piano") {
    const existingPiece = this.getPieceByHash(hash)
    if(!existingPiece) {
      const cid = await this.pieces.put({ hash, instrument })
      return cid
    } else {
      return await this.updatePieceByHash(hash, instrument)
    }
  }

  async updatePieceByHash(hash, instrument = piano) {
    const piece = await this.getPieceByHash(hash)
    piece.instrument = instrument
    return await this.pieces.put(piece)
  }

  async deletePieceByHash(hash) {
    return await this.pieces.del(hash)
  }

  getAllPieces() {
    const pieces = this.pieces.get("")
    return pieces
  }

  getPieceByHash(hash) {
    const singlePiece = this.pieces.get(hash)[0]
    return singlePiece
  }

  getPieceByInstrument(instrument) {
    return this.pieces.query(piece => piece.instrument === instrument)
  }
}

try {
    const Ipfs = require('ipfs')
    const OrbitDB = require('orbit-db')

    module.exports = exports = new NewPiecePlease(Ipfs, OrbitDB)
} catch (e) {
    window.NPP = new NewPiecePlease(window.Ipfs, window.OrbitDB)
}
