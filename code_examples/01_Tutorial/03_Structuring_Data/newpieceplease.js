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
    const peerInfo = await this.node.id()
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

    this.user = await this.orbitdb.kvstore("user", this.defaultOptions)
    await this.user.load()

    await this.loadFixtureData({
      "username": Math.floor(Math.random()* 100000),
      "pieces": this.pieces.id,
      "nodeId" : peerInfo.id
    })

    this.onready()
  }

  async addNewPiece(hash, instrument = "Piano") {
    const existingPiece = this.getPieceByHash(hash)
    if(!existingPiece) {
      const dbName = "counter." + hash.substr(20,20)
      const counter = await this.orbitdb.counter(dbName, this.defaultOptions)

      const cid = await this.pieces.put({ hash, instrument,
        counter: counter.id
      })
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

  async getPracticCount(piece) {
    const counter = await this.orbitdb.counter(piece.counter)
    await counter.load()
    return counter.value
  }

  async incrementPracticeCounter(piece) {
    const counter = await this.orbitdb.counter(piece.counter)
    const cid = await counter.inc()
    return cid
  }

  async deleteProfileField(key) {
    const cid = await this.user.del(key)
    return cid
  }

  getAllProfileFields() {
    return this.user.all
  }

  getProfileField(key) {
    return this.user.get(key)
  }

  async updateProfileField(key, value) {
    const cid = await this.user.set(key, value)
    return cid
  }

  async loadFixtureData(fixtureData) {
    const fixtureKeys = Object.keys(fixtureData)
    for(let i in fixtureKeys) {
      let key = fixtureKeys[i]
      if(!this.user.get(key)) await this.user.set(key, fixtureData[key])
    }
  }
}

try {
    const Ipfs = require('ipfs')
    const OrbitDB = require('orbit-db')

    module.exports = exports = new NewPiecePlease(Ipfs, OrbitDB)
} catch (e) {
    window.NPP = new NewPiecePlease(window.Ipfs, window.OrbitDB)
}
