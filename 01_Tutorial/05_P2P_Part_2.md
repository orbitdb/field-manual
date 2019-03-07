## Chapter 5: Peer-to-Peer Part 2 (OrbitDB)

> TODO: Description

<div>
  <h3>Table of Contents</h3>

Please complete [Chapter 4 - Peer to Peer](./04_P2P_Part_1.md) first.

- [Enabling debug logging](#enabling debug logging)
- [Discovering Peer's Databases](#discovering-peers-databases)
- [Connecting automatically to peers via IPFS bootstrap](#connecting-to-another-peers-database)
- [Simple distributed queries](#simple-distributed-queries)
- [Key takeaways](#key-takeaways)

</div>

### Enabling debug logging

There's a lot of moving parts in connecting to a peer's OrbitDB database, and you'll want a deeper look into what's going on as you start to work with connections.

Throughout the OrbitDB / IPFS stack, logging is controlled via a global variable called `LOG` which uses string pattern matching to filter and display logs, e.g. `LOG="*"` will show all logs and be very noisy.

In node.js, you can enable this by passing an environment variable before the invocation of the `node` command:

```bash
$ LOG="orbit*" node
```

In the browser, you can set this as a global variable on `window`:

```javascript
window.LOG="orbit*"
```

Then, once you re-run the app, you should see a great deal of console info, abridged here:

```plain
[DEBUG] orbit-db: open()
[DEBUG] orbit-db: Open database '/orbitdb/zdpuAz77YioswjyfnnqVDhjycEn4BKFhvxfipTH7y4LCnjvBz/pieces'
[DEBUG] orbit-db: Look from './orbitdb'
[DEBUG] cache: load, database: /orbitdb/zdpuAz77YioswjyfnnqVDhjycEn4BKFhvxfipTH7y4LCnjvBz/pieces
[DEBUG] orbit-db: Found database '/orbitdb/zdpuAz77YioswjyfnnqVDhjycEn4BKFhvxfipTH7y4LCnjvBz/pieces'
[DEBUG] orbit-db: Loading Manifest for '/orbitdb/zdpuAz77YioswjyfnnqVDhjycEn4BKFhvxfipTH7y4LCnjvBz/pieces'
[DEBUG] orbit-db: Manifest for '/orbitdb/zdpuAz77YioswjyfnnqVDhjycEn4BKFhvxfipTH7y4LCnjvBz/pieces':
{
  "name": "pieces",
  "type": "docstore",
  "accessController": "/ipfs/zdpuB1XW983eHNiCcUFEiApGFt1UEbsfqTBQ7YAYnkVNpLiPF"
}
[DEBUG] cache: load, database: /orbitdb/zdpuAz77YioswjyfnnqVDhjycEn4BKFhvxfipTH7y4LCnjvBz/pieces
[DEBUG] orbit-db: Saved manifest to IPFS as 'zdpuAz77YioswjyfnnqVDhjycEn4BKFhvxfipTH7y4LCnjvBz'
[DEBUG] cache: load, database: /orbitdb/zdpuAz77YioswjyfnnqVDhjycEn4BKFhvxfipTH7y4LCnjvBz/pieces
```

### What just happened?

You enabled debug logging in the app for orbitdb so you can get detailed information about what's going on when you run certain commands.

- `Open database` corresponds to your `this.orbitdb.keyvalue`, `this.orbitdb.docs` calls which are wrappers around `this.orbitdb.open({ type: "keyvalue|docs" })`
- The database `manifest` is a JSON document stored via `ipfs.dag.put` at the address in the database location, `zdpuAz77YioswjyfnnqVDhjycEn4BKFhvxfipTH7y4LCnjvBz` in the above examples. Try using `NPP.node.dag.get()` to explore that content!
- `load` calls then read the database contents into memory and correspond with your `db.load` calls.

Much more information about what's going on internally is provided in Part 3 of this book, OrbitDB Architecture.

### Discovering Peer's Databases

To share data between peers, you will need to know their OrbitDB address. Unforutately, simply connecting to a peer is not enough, since there's not a simple way to obtain databases address from a simple IPFS peer-to-peer connection. To remedy this, you'll create a simple flow that exchanges user information via IPFS pubsub, and then use OrbitDB's loading and event system to load and display the data.

In order to provide a proper user experience, you'll want to hide as much of the peer and database discovery as possible by using OrbitDB and IPFS internals to exchange database addresses and load data upon peer connection.

The flow will be:
1. User manually requests a connection to a user
2. On a successful connection, both peers send messages containing their user information via a database address
3. 
4. 

First, update your `handlePeerConnected` function to call `sendMessage` we introduce a timeout here to give the peers a second or two to breathe once they are connected. You can later tune this, or remove it as you see fit and as future IPFS features provide greater network reliability and performance.

```diff
  handlePeerConnected(ipfsPeer) {
    const ipfsId = ipfsPeer.id._idB58String;
+   setTimeout(async () => {$                          
+     await this.sendMessage(ipfsId, { userDb: this.user.id })
+   }, 2000)$
    if(this.onpeerconnect) this.onpeerconnect(ipfsPeer)
  }
```

Then, add the `handleMessageReceived` function to the `NewPiecePlease` class

```diff
+ async handleMessageReceived(msg) {
+   const parsedMsg = JSON.parse(msg.data.toString())
+   const msgKeys = Object.keys(parsedMsg)
+
+   switch(msgKeys[0]) {
+     case "userDb":
+       var peerDb = await this.orbitdb.open(parsedMsg.userDb)
+       peerDb.events.on("replicated", async () => {
+         if(peerDb.get("pieces")) {
+           await this.companions.set(peerDb.id, peerDb._index._index)
+           this.ondbdiscovered && this.ondbdiscovered(peerDb)
+         }
+       })
+       break;
+     default:
+       break;
+   }
+
+   if(this.onmessage) this.onmessage(msg)
+ }
```

```diff
async _init() {$                                                                      
  const nodeInfo = await this.node.id()$                                              
  this.orbitdb = await OrbitDB.createInstance(this.node)$                             
  this.defaultOptions = { accessController: { write: [this.orbitdb.identity.publicKey] }}

  const docStoreOptions = Object.assign(this.defaultOptions, { indexBy: 'hash' })
  this.pieces = await this.orbitdb.docs('pieces', docStoreOptions)
  await this.pieces.load()

  this.user = await this.orbitdb.keyvalue("user", this.defaultOptions)
  await this.user.load()

  this.companions = await this.orbitdb.keyvalue("companions", this.defaultOptions)
  await this.companions.load()

  await this.loadFixtureData({
    "username": Math.floor(Math.random() * 1000000),
    "pieces": this.pieces.id,
    "nodeId": nodeInfo.id,
  })

  this.node.libp2p.on("peer:connect", this.handlePeerConnected.bind(this))
  await this.node.pubsub.subscribe(nodeInfo.id, this.handleMessageReceived.bind(this))

  if(this.onready) this.onready()
}
```
#### What just happened?

> **Note:** If you're a security-minded person, this is probably giving you a panic attack. That's ok, these methods are for educational purposes only and are meant to enhance your understanding of how a system like this works. We will cover authorization and authentication in the next chapter.

### Key takeaways

Continue to [Chapter 6](./06_Identity_Permissions.md) to learn about how you can vastly extend the identity and access control capabilities of OrbitDB
