## Chapter 5: Peer-to-Peer Part 2 (OrbitDB)

> OrbitDB utilizes IPFS's underlying peer-to-peer laer to share data between peers. In this chapter you will learn methods for _discovering peers_, _connecting automatically to known peers_, and making _distributed queries_.

<div>
  <h3>Table of Contents</h3>

Please complete [Chapter 4 - Peer to Peer](./04_P2P_Part_1.md) first.

- [Enabling debug logging](#enabling-debug-logging)
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

#### What just happened?

You enabled debug logging in the app for orbitdb so you can get detailed information about what's going on when you run certain commands.

- `Open database` corresponds to your `this.orbitdb.keyvalue`, `this.orbitdb.docs` calls which are wrappers around `this.orbitdb.open({ type: "keyvalue|docs" })`
- The database `manifest` is a JSON document stored via `ipfs.dag.put` at the address in the database location, `zdpuAz77YioswjyfnnqVDhjycEn4BKFhvxfipTH7y4LCnjvBz` in the above examples. Try using `NPP.node.dag.get()` to explore that content!
- `load` calls then read the database contents into memory and correspond with your `db.load` calls.

Much more information about what's going on internally is provided in Part 3 of this book, OrbitDB Architecture.

### Discovering Peer's Databases

To share data between peers, you will need to know their OrbitDB address. Unforutately, simply connecting to a peer is not enough, since there's not a simple way to obtain databases address from a simple IPFS peer-to-peer connection. To remedy this, you'll create a simple flow that exchanges user information via IPFS pubsub, and then use OrbitDB's loading and event system to load and display the data.

In order to provide a proper user experience, you'll want to hide as much of the peer and database discovery as possible by using OrbitDB and IPFS internals to exchange database addresses and load data upon peer connection.

The flow you'll create will be:

1. User manually requests a connection to a user
2. On a successful connection, both peers send messages containing their user information via a database address
3. Peer user databases are loaded, replicated, and inspected for a `userDb` key
4. On a successful discovery, user information is added to our local `companions` database

First, update your `handlePeerConnected` function to call `sendMessage` we introduce a timeout here to give the peers a second or two to breathe once they are connected. You can later tune this, or remove it as you see fit and as future IPFS features provide greater network reliability and performance.

```diff
  handlePeerConnected(ipfsPeer) {
    const ipfsId = ipfsPeer.id._idB58String;
+   setTimeout(async () => {
+     await this.sendMessage(ipfsId, { userDb: this.user.id })
+   }, 2000)$
    if(this.onpeerconnect) this.onpeerconnect(ipfsPeer)
  }
```

Then, register and add the `handleMessageReceived` function to the `NewPiecePlease` class

```diff
async _init() {
  const nodeInfo = await this.node.id()
  this.orbitdb = await OrbitDB.createInstance(this.node)
  this.defaultOptions = { accessController: { write: [this.orbitdb.identity.publicKey] }}

  const docStoreOptions = Object.assign(this.defaultOptions, { indexBy: 'hash' })
  this.pieces = await this.orbitdb.docs('pieces', docStoreOptions)
  await this.pieces.load()

  this.user = await this.orbitdb.keyvalue("user", this.defaultOptions)
  await this.user.load()

  await this.loadFixtureData({
    "username": Math.floor(Math.random() * 1000000),
    "pieces": this.pieces.id,
    "nodeId": nodeInfo.id,
  })

  this.node.libp2p.on("peer:connect", this.handlePeerConnected.bind(this))
+ await this.node.pubsub.subscribe(nodeInfo.id, this.handleMessageReceived.bind(this))

  if(this.onready) this.onready()
}
```

Finally, create the `handleMessageReceived` function:

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

In your application code you can use this functionality like so:

```javascript
// Connect to a peer that you know has a New Piece, Please! user database
await NPP.connectToPeer("Qm.....")

NPP.ondbdiscovered = (db) => console.log(db.all())
/* outputs:
{
  "nodeId": "QmNdQgScpUFV19PxvUQ7mtibtmce8MYQkmN7PZ37HApprS",
  "pieces": "/orbitdb/zdpuAppq7gD2XwmfxWZ3MzeucEKiMYonRUXVwSE76CLQ1LDxn/pieces",
  "username": 875271
}
*/
```

#### What just happened?

You updated your code to send a message to connected peers after 2 seconds, and then registered a handler function for this message that connects to and replicates another user's database.

- `this.sendMessage(ipfsId, { userDb: this.user.id })` utilizes the function you created previously to send a message to a peer via a topic named from their IPFS id
- `this.node.pubsub.subscribe` registers an event handler that calls `this.handleMessageReceived`
- `peerDb.events.on("replicated" ...` fires when the database has been loaded and the data has been retrieved from IPFS and is stored locally. It means, simply, that you have the data and it is ready to be used.

> **Note:** If you're a security-minded person, this is probably giving you a panic attack. That's ok, these methods are for educational purposes only and are meant to enhance your understanding of how a system like this works. We will cover authorization and authentication in the next chapter.

### Connecting automatically to peers with discovered databases

Peer discovery is great, but your users are going to want those peers to stick around so you can continue to use their data and receive new data as those peers add pieces. You'll make a couple minor modifications the above functions to enable that now. Also, peers is so technical sounding! Musicians might prefer something like "companions" instead.

First, update your `_init` function to make a new "companions" database:

```diff
async _init() {
  const nodeInfo = await this.node.id()
  this.orbitdb = await OrbitDB.createInstance(this.node)
  this.defaultOptions = { accessController: { write: [this.orbitdb.identity.publicKey] }}

  const docStoreOptions = Object.assign(this.defaultOptions, { indexBy: 'hash' })
  this.pieces = await this.orbitdb.docs('pieces', docStoreOptions)
  await this.pieces.load()

  this.user = await this.orbitdb.keyvalue("user", this.defaultOptions)
  await this.user.load()
  
+ this.companions = await this.orbitdb.keyvalue("companions", this.defaultOptions)
+ await this.companions.load()

  await this.loadFixtureData({
    "username": Math.floor(Math.random() * 1000000),
    "pieces": this.pieces.id,
    "nodeId": nodeInfo.id,
  })

  this.node.libp2p.on("peer:connect", this.handlePeerConnected.bind(this))
  await this.node.pubsub.subscribe(nodeInfo.id, this.handleMessageReceived.bind(this))

+ this.companionConnectionInterval = setInterval(this.connectToCompanions.bind(this), 10000)
+ this.connectToCompanions()

  if(this.onready) this.onready()
}
```

Next, create a `getCompanions()` abstraction for your application layer

```diff
+ getCompanions() {
+   return this.companions.all()
+ }
```

Then, update your `handleMessageReceived` function to add a discovered peer's user database to the `companions` register:

```diff
  async handleMessageReceived(msg) {
    const parsedMsg = JSON.parse(msg.data.toString())
    const msgKeys = Object.keys(parsedMsg)

    switch(msgKeys[0]) {
      case "userDb":
        var peerDb = await this.orbitdb.open(parsedMsg.userDb)
        peerDb.events.on("replicated", async () => {
          if(peerDb.get("pieces")) {
+           await this.companions.set(peerDb.id, peerDb.all())
            this.ondbdiscovered && this.ondbdiscovered(peerDb)
          }
        })
        break;
      default:
        break;
    }

    if(this.onmessage) this.onmessage(msg)
  }
```

Finally, create the `connectToCompanions` function:

```diff
+ async connectToCompanions() {
+   var companionIds = Object.values(this.companions.all()).map(companion => companion.nodeId)
+   var connectedPeerIds = await this.getIpfsPeers()$
+   companionIds.map(async (companionId) => {
+     if (connectedPeerIds.indexOf(companionId) !== -1) return
+     try {
+       await this.connectToPeer(companionId)
+       this.oncompaniononline && this.oncompaniononline()
+     } catch (e) {
+       this.oncompanionnotfound && this.oncompanionnotfound()
+     }
+   })
+ }
```

In your application layer, you can test this functionality like so:

```javascript
NPP.oncompaniononline = console.log
NPP.oncompanionnotfound = () => { throw(e) }
```

#### What just happened?

You created yet another database for your user's musical companions, and updated this database upon database discovery. You can use this to create "online indicators" for all companions in your UI layer.

- `await this.orbitdb.keyvalue("companions", this.defaultOptions)` creates a new keyvalue store called "companions"
- `this.companions.all()` retrieves the full list of key/value pairs from the database
- `this.companions.set(peerDb.id, peerDb.all())` adds a record to the companions database, with the database ID as the key, and the data as the value stored. Note that you can do nested keys and values inside a `keyvalue` store
- The `companionIds.map` call will then call `this.connectToPeer(companionId)` in parallel for all registered companions in your database. If they are found `oncompaniononline` will fire. If not, `oncompanionnotfound` will fire next.

### Simple distributed queries

This may be the moment you've been waiting for - now you'll perform a simple parallel distributed query on across multiple peers, pooling all pleces together into one result.

Create the following function, which combines much of the code you've written and knowledge you've obtained so far:

```diff
+ async queryCatalog() {
+   const peerIndex = NPP.companions.all()
+   const dbAddrs = Object.keys(peerIndex).map(key => peerIndex[key].pieces)
+
+   const allPieces = await Promise.all(dbAddrs.map(async (addr) => {
+     const db = await this.orbitdb.open(addr)
+     await db.load()
+
+     return db.get('')
+   }))
+
+   return allPieces.reduce((flatPieces, pieces) => {
+     pieces.forEach(p => flatPieces.push(p))
+     return flatPieces
+   }, this.pieces.get(''))
+ }
```

You can now test this by creating a few different instances of the app (try both browser and node.js instances), connecting them via their peer IDs, discovering their databases, and running `NPP.queryCatalog()`.

#### What just happened?

You performed your first distributed query using OrbitDB. We hope that by now the power of such a simple system, under 200 lines of code so far, can be used to create distributed applications.

- `NPP.companions.all()` will return the current list of discovered companions
- `this.orbitdb.open(addr)` will open the peer's database and `db.load` will load it into memory
- `allPieces.reduce` will take an array of arrays and squash it into a flat array

For now it will return _all_ pieces, but for bonus points you can try incorporating the `docstore.query` function instaed of `docstore.get('')`.

### Key takeaways

- Debug logging can be enabled through a global `LOG` variable
- You cannot discover a user's database address through their IPFS id
- Database discovery, however, can be achieved by utilizing the IPFS pubsub
- When a database is `replicated`, you reliably have access to the data you requested.
- Automatic peer connection can be achieved programmatically based on the data in your database
- Once you have a registry of databases with the same schema, you can write JavaScript functions to perform distributed, parallel queries

<strong>You're not done yet! [Chapter 6](./06_Identity_Permission.md) to learn about how you can vastly extend the identity and access control capabilities of OrbitDB</strong>
