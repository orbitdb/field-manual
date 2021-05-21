class NewPiecePlease {
    constructor (Ipfs, OrbitDB) {
      this.OrbitDB = OrbitDB
      this.Ipfs = Ipfs
    }

    async create() {
      this.node = await this.Ipfs.create({
        repo: './ipfs',
      })

      this._init()
    }

    async _init () {
        const nodeInfo = await this.node.id()
        this.orbitdb = await this.OrbitDB.createInstance(this.node)

        this.defaultOptions = {
          accessController: {
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
        await this.user.set('pieces', this.pieces.id)

        await this.loadFixtureData({
            "username": Math.floor(Math.random() * 1000000),
            "pieces": this.pieces.id,
            "nodeId": nodeInfo.id
        })

        this.companions = await this.orbitdb.keyvalue("companions", this.defaultOptions)
        await this.companions.load()

        this.node.libp2p.on("peer:connect", this.handlePeerConnected.bind(this))
        await this.node.pubsub.subscribe(nodeInfo.id, this.handleMessageReceived.bind(this))

        this.companionConnectionInterval = setInterval(this.connectToCompanions.bind(this), 10000)
        this.connectToCompanions()

        // when the OrbitDB docstore has loaded, intercept this method to
        // carry out further operations.
        this.onready()
    }

    async addNewPiece(hash, instrument = "Piano") {
        const existingPiece = this.pieces.get(hash)

        if(existingPiece.length > 0) {
            const cid = await this.updatePieceByHash(hash, instrument)
            return;
        }

        const dbName = "counter." + hash.substr(20,20)
        const counter = await this.orbitdb.counter(dbName, this.defaultOptions)

        const cid = await this.pieces.put({
           hash: hash,
           instrument: instrument,
           counter: counter.id
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

	getByInstrument(instrument) {
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

    async getPracticeCount(piece) {
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
        return this.user.all;
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

        for (let i in fixtureKeys) {
            let key = fixtureKeys[i]

            if(!this.user.get(key)) await this.user.set(key, fixtureData[key])
        }
    }

    async getIpfsPeers() {
        const peers = await this.node.swarm.peers()
        return peers
    }

    async connectToPeer(multiaddr, protocol = "/p2p-circuit/ipfs/") {
        try {
            await this.node.swarm.connect(protocol + multiaddr)
        } catch(e) {
            throw (e)
        }
    }

    handlePeerConnected(ipfsPeer) {
        const ipfsId = ipfsPeer.id._idB58String;

        setTimeout(async () => {
            await this.sendMessage(ipfsId, { user: this.user.id })
        }, 2000)

        if(this.onpeerconnect) this.onpeerconnect(ipfsId)
    }

    async handleMessageReceived(msg) {
        const parsedMsg = JSON.parse(msg.data.toString())
        const msgKeys = Object.keys(parsedMsg)

        switch (msgKeys[0]) {
            case "user":
                var peer = await this.orbitdb.open(parsedMsg.user)
                peer.events.on("replicated", async () => {
                    if (peer.get("pieces")) {
                        await this.companions.set(peer.id, peer.all)
                        this.ondbdiscovered && this.ondbdiscovered(peer)
                    }
                })
                break;
            default:
                break;
        }

        if(this.onmessage) this.onmessage(msg)
    }

    async sendMessage(topic, message, callback) {
        try {
            const msgString = JSON.stringify(message)
            const messageBuffer = this.getBuffer().from(msgString)
            await this.node.pubsub.publish(topic, messageBuffer)
        } catch (e) {
            throw (e)
        }
    }

    getBuffer() {
        return (typeof Buffer === "undefined") ? Ipfs.Buffer : Buffer
    }

    getCompanions() {
        return this.companions.all
    }

    async connectToCompanions() {
        const companionIds = Object.values(this.companions.all).map(companion => companion.nodeId)
        const connectedPeerIds = await this.getIpfsPeers()
        companionIds.forEach(async (companionId) => {
            if (connectedPeerIds.indexOf(companionId) !== -1) return
            try {
                await this.connectToPeer(companionId)
                this.oncompaniononline && this.oncompaniononline()
            } catch (e) {
                this.oncompanionnotfound && this.oncompanionnotfound()
            }
        })
    }

    async queryCatalog() {
        const peerIndex = NPP.companions.all()
        const dbAddrs = Object.keys(peerIndex).map(key => peerIndex[key].pieces)

        const allPieces = await Promise.all(dbAddrs.map(async (addr) => {
            const db = await this.orbitdb.open(addr)
            await db.load()

            return db.get('')
        }))

        return allPieces.reduce((flatPieces, pieces) => {
            pieces.forEach(p => flatPieces.push(p))
            return flatPieces
        }, this.pieces.get(''))
    }
}

try {
    const Ipfs = require('ipfs')
    const OrbitDB = require('orbit-db')
    module.exports = exports = new NewPiecePlease(Ipfs, OrbitDB)
} catch (e) {
    window.NPP = new NewPiecePlease(window.Ipfs, window.OrbitDB)
}
