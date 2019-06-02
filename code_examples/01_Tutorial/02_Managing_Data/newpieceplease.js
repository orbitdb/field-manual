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
        this.defaultOptions = { accessController: { write: [this.orbitdb.identity.publicKey] }}

        const docStoreOptions = {
          ...this.defaultOptions,
          indexBy: 'hash',
        }

        this.pieces = await this.orbitdb.docstore('pieces', docStoreOptions)
        await this.pieces.load()

        this.onready()
    }

    async addNewPiece(hash, instrument = "Piano") {
        const existingPiece = this.pieces.get(hash)

        if(existingPiece.length > 0) {
            const cid = await this.updatePieceByHash(hash, instrument)
            return;
        }

        const cid = await this.pieces.put({
           hash: hash,
           instrument: instrument
        })

	   return cid
    }

	getAllPieces() {
		const pieces = this.pieces.get('')
		return pieces
	}

	getPieceByHash(hash) {
		const singlePiece = this.pieces.get(hash)[0]
		return singlePiece
	}

	getPieceByInstrument(instrument) {
	  	return this.pieces.query((piece) => piece.instrument === instrument)
	}

	async updatePieceByHash(hash, instrument = "Piano") {
		const piece = await this.getPieceByHash(hash)
		piece.instrument = instrument
		const cid = await this.pieces.put(piece)
		return cid
	}

	async deletePieceByHash(hash) {
		const cid = await this.pieces.del(hash)
		return cid
	}
}

try {
    const Ipfs = require('ipfs')
    const OrbitDB = require('orbit-db')
    module.exports = exports = new NewPiecePlease(Ipfs, OrbitDB)
} catch (e) {
    window.NPP = new NewPiecePlease(window.Ipfs, window.OrbitDB)
}
