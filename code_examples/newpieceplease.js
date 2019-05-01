class NewPiecePlease {
  constructor (IPFS, OrbitDB) {
    this.OrbitDB = OrbitDB

    this.node = new IPFS({
      preload: { enabled: false },
      repo: './ipfs',
      EXPERIMENTAL: { pubsub: true },
      config: {
        Bootstrap: [],
        Addresses: { Swarm: [] }
      }
    })

    this.node.on('error', (e) => { throw (e) })
    this.node.on('ready', this._init.bind(this))
  }

  async _init () {
    this.orbitdb = await this.OrbitDB.createInstance(this.node)
    this.onready()
  }
}
