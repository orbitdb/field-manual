## Chapter 5: Peer-to-Peer Part 2 (OrbitDB)

> **Note:** Please complete [Chapter 4 - Peer to Peer](./04_P2P_Part_1.md) first.

<div>
  <h3>Table of Contents</h3>
 
- [Connecting to another peer's database](#connecting-to-another-peers-database)

</div>

### Connecting to another peer's database

To share data between peers, you will need to know their OrbitDB address. Unforutately, simply connecting to a peer is not enough, since there's not an simple way to obtain databases address from a simply IPFS peer-to-peer connection. To remedy this, you'll write your OrbitDB address to IPFS. Then, you'll share the hash to peers you want to connect to. 

It will be helpful to ensure you are connected to the peer first, via the steps in the previous chapter.

Create a function called `processMessage` and update `connectToOrbitDb` inside the `NewPiecePlease` class:

```javascript
async connectToOrbitDb(multiaddr) {
  try {
    var peerDb = await this.orbitdb.keyvalue(multiaddr)
    await peerDb.load()

    var peers = Object.assign({}, this.userDb.get("peers"))
    peers[peerDb.id] = peerDb._index._index
    console.log(peers)
  } catch (e) {
    throw (e)
  }
}

processMessage(msg) {
  const parsedMsg = JSON.parse(msg.data.toString())
  Object.keys(parsedMsg).forEach(async (key) => {
    switch(key) {
      case "userDb":
        this.connectToOrbitDb(parsedMsg.userDb)
        const peerDb = await this.orbitdb.keyvalue(parsedMsg.userDb)
        this.sendMessage(peerDb.get("nodeId"), {
          userDb: this.userDb.id
        })
        break;
      default:
        break;
    }
  })
}
```

Inside your application code, you can use it like so:

```javascript
```

### Replication vs. Duplication

### Key Takeaways

Continue to [Chapter 6](./06_Identity_Permissions.md) to learn about how you can vastly extend the identity and access control capabilities of OrbitDB
