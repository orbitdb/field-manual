## Chapter 4: Peer-to-Peer, Part 1 (The IPFS Layer)

> There's a lot of ground to cover as we move from offline to fully peer-to-peer, and we need to start where it starts: _connecting to IPFS_, _connecting directly to peers_, and _communicating with them via IPFS pubsub._

<div>
  <h3>Table of Contents</h3>

Please complete [Chapter 3 - Structuring Data](./03_Structuring_Data.md) first.

- [Connecting to the global IPFS network](#connecting-to-the-global-ipfs-network)
- [Getting a list of connected peers](#getting-a-list-of-connected-peers)
- [Manually connecting to peers](#manually-connecting-to-peers)
- [Peer to peer communication via IPFS pubsub](#peer-to-peer-communication-via-IPFS-pubsub)
- [Key takeaways](#key-takeaways)

</div>

### Connecting to the global IPFS network

Your users can manage their local sheet music library, but music is a social, connected venture. The app should reflect that! You will now reconfigure your IPFS node to connect to the global network and begin swarming with other peers.  This tutorial started offline to focus on OrbitDB's core concepts, and now you will undo this and connect the app, properly, to the global IPFS network.

To do so, the `NewPiecePlease` constructor like so:

```diff
class NewPiecePlease {
  constructor (IPFS, OrbitDB) {
    this.node = new IPFS({
-     preload: { enabled: false }
+     relay: { enabled: true, hop: { enabled: true, active: true } },
      EXPERIMENTAL: { pubsub: true },
      repo: "./ipfs",
-     config: {  Bootstrap: [], Addresses: { Swarm: [] } }
    });
```

Now, you can either delete your data, by deleting the `ipfs` and `orbitdb` folders in node.js, or by clearing your local data in the browser, or you can restore locally. If you don't mind doing this, you can skip ahead to [Getting a list of connected peers](#getting-a-list-of-connected-peers).

#### Restoring default IPFS config values

If you don't want to blow away your data, then you can manually restore the default values by running a few commands on the application layer.

#### Restoring your default bootstrap peers

Bootstrap peers are peers that your node connects to automatically when it starts. IPFS supplies this list by default and is comprised of a decentralized set of public IPFS servers.

However, since we purposefully started with an empty list of bootstrap peers and they won't be restored by simply removing the config values. This is because bootstrap and swarm values are persisted in your IPFS config. This is located in the filesystem in the case of node.js and in IndexedDB in the case of the browser. You should not manually edit these files.

However, nothing will change yet when you run the app. To see this, run this command in a running application:

```javascript
await NPP.node.bootstrap.list()
// outputs []
```

To restore the default peers, like the one generated in the previous chapters, run this command _once_ to restore your default bootstrap peers.

```javascript
this.node.bootstrap.add(undefined, { default: true })
```

Re-running `bootstrap.list` now gives you a colorful array of bootstrap peers, ready to be connected to.

```javascript
await NPP.node.bootstrap.list()
/* outputs:
'/ip4/104.236.176.52/tcp/4001/ipfs/QmSoLnSGccFuZQJzRadHn95W2CrSFmZuTdDWP8HXaHca9z',
'/ip4/104.131.131.82/tcp/4001/ipfs/QmaCpDMGvV2BGHeYERUEnRQAwe3N8SzbUtfsmvsqQLuvuJ',
'/ip4/104.236.179.241/tcp/4001/ipfs/QmSoLPppuBtQSGwKDZT2M73ULpjvfd3aZ6ha4oFGL1KrGM',
'/ip4/162.243.248.213/tcp/4001/ipfs/QmSoLueR4xBeUbY9WZ9xGUUxunbKWcrNFTDAadQJmocnWm',
'/ip4/128.199.219.111/tcp/4001/ipfs/QmSoLSafTMBsPKadTEgaXctDQVcqN88CNLHXMkTNwMKPnu',
'/ip4/104.236.76.40/tcp/4001/ipfs/QmSoLV4Bbm51jM9C4gDYZQ9Cy3U6aXMJDAbzgu2fzaDs64',
'/ip4/178.62.158.247/tcp/4001/ipfs/QmSoLer265NRgSp2LA3dPaeykiS1J6DifTC88f5uVQKNAd',
'/ip4/178.62.61.185/tcp/4001/ipfs/QmSoLMeWqB7YGVLJN3pNLQpmmEk35v6wYtsMGLzSr5QBU3',
'/ip4/104.236.151.122/tcp/4001/ipfs/QmSoLju6m7xTh3DuokvT3886QRYqxAzb1kShaanJgW36yx',
'/ip6/2604:a880:1:20::1f9:9001/tcp/4001/ipfs/QmSoLnSGccFuZQJzRadHn95W2CrSFmZuTdDWP8HXaHca9z',
'/ip6/2604:a880:1:20::203:d001/tcp/4001/ipfs/QmSoLPppuBtQSGwKDZT2M73ULpjvfd3aZ6ha4oFGL1KrGM',
'/ip6/2604:a880:0:1010::23:d001/tcp/4001/ipfs/QmSoLueR4xBeUbY9WZ9xGUUxunbKWcrNFTDAadQJmocnWm',
'/ip6/2400:6180:0:d0::151:6001/tcp/4001/ipfs/QmSoLSafTMBsPKadTEgaXctDQVcqN88CNLHXMkTNwMKPnu',
'/ip6/2604:a880:800:10::4a:5001/tcp/4001/ipfs/QmSoLV4Bbm51jM9C4gDYZQ9Cy3U6aXMJDAbzgu2fzaDs64',
'/ip6/2a03:b0c0:0:1010::23:1001/tcp/4001/ipfs/QmSoLer265NRgSp2LA3dPaeykiS1J6DifTC88f5uVQKNAd',
'/ip6/2a03:b0c0:1:d0::e7:1/tcp/4001/ipfs/QmSoLMeWqB7YGVLJN3pNLQpmmEk35v6wYtsMGLzSr5QBU3',
'/ip6/2604:a880:1:20::1d9:6001/tcp/4001/ipfs/QmSoLju6m7xTh3DuokvT3886QRYqxAzb1kShaanJgW36yx',
'/dns4/node0.preload.ipfs.io/tcp/443/wss/ipfs/QmZMxNdpMkewiVZLMRxaNxUeZpDUb34pWjZ1kZvsd16Zic',
'/dns4/node1.preload.ipfs.io/tcp/443/wss/ipfs/Qmbut9Ywz9YEDrz8ySBSgWyJk41Uvm2QJPhwDJzJyGFsD6'
*/
```

#### Enabling the swarm

Next, you will restore your default swarm addresses. These are addresses that your node announces itself to the world on.

Luckily, in the browser you don't have to do anything, the default is an empty array. You should already see something like this in your console:

```plain
Swarm listening on /p2p-circuit/ipfs/QmWxWkrCcgNBG2uf1HSVAwb9RzcSYYC2d6CRsfJcqrz2FX
Swarm listening on /p2p-circuit/p2p-websocket-star/ipfs/QmWxWkrCcgNBG2uf1HSVAwb9RzcSYYC2d6CRsfJcqrz2FX
```

In node.js, run this command:

```javascript
NPP.node.config.set("Addresses.Swarm", ['/ip4/0.0.0.0/tcp/4002', '/ip4/127.0.0.1/tcp/4003/ws'], console.log)
```

After restarting your app you will see the console output confirming you're swarming. In node.js you will see something like:

```plain
Swarm listening on /p2p-websocket-star/ipfs/QmXG8yk8UJjMT6qtE2zSxzz3U7z5jSYRgVWLCUFqAVnByM
Swarm listening on /ip4/127.0.0.1/tcp/4002/ipfs/QmXG8yk8UJjMT6qtE2zSxzz3U7z5jSYRgVWLCUFqAVnByM
Swarm listening on /ip4/172.16.100.191/tcp/4002/ipfs/QmXG8yk8UJjMT6qtE2zSxzz3U7z5jSYRgVWLCUFqAVnByM
Swarm listening on /ip4/172.17.0.1/tcp/4002/ipfs/QmXG8yk8UJjMT6qtE2zSxzz3U7z5jSYRgVWLCUFqAVnByM
Swarm listening on /ip4/127.0.0.1/tcp/4003/ws/ipfs/QmXG8yk8UJjMT6qtE2zSxzz3U7z5jSYRgVWLCUFqAVnByM
Swarm listening on /p2p-circuit/ipfs/QmXG8yk8UJjMT6qtE2zSxzz3U7z5jSYRgVWLCUFqAVnByM
Swarm listening on /p2p-circuit/p2p-websocket-star/ipfs/QmXG8yk8UJjMT6qtE2zSxzz3U7z5jSYRgVWLCUFqAVnByM
Swarm listening on /p2p-circuit/ip4/127.0.0.1/tcp/4002/ipfs/QmXG8yk8UJjMT6qtE2zSxzz3U7z5jSYRgVWLCUFqAVnByM
Swarm listening on /p2p-circuit/ip4/172.16.100.191/tcp/4002/ipfs/QmXG8yk8UJjMT6qtE2zSxzz3U7z5jSYRgVWLCUFqAVnByM
Swarm listening on /p2p-circuit/ip4/172.17.0.1/tcp/4002/ipfs/QmXG8yk8UJjMT6qtE2zSxzz3U7z5jSYRgVWLCUFqAVnByM
Swarm listening on /p2p-circuit/ip4/127.0.0.1/tcp/4003/ws/ipfs/QmXG8yk8UJjMT6qtE2zSxzz3U7z5jSYRgVWLCUFqAVnByM
```

You can get the addresses that your node is publishing on via the following command:

```javascript
const id = await NPP.node.id()
console.log(id.addresses)
```

You will see a list of addresses your node is publishing on. Expect the browser to have only 2, and node.js to have more. Since we're dealing with both node.js and the browser, we'll focus on the addresses starting with `p2p-circuit`.

#### What just happened?

Before this, you were working offline. Now you're not. You've been connected to the global IPFS network and are ready for peer to-peer connections.

- Removing `preload: { enabled: false }` enables connection to the bottom two nodes from the above bootstrap list.
- Removing `config: {  Bootstrap: [], Addresses: { Swarm: [] } }` will prevent the storing of empty arrays in your config files for the `Bootstrap` and `Addresses.Swarm` config keys
- `this.node.bootstrap.add(undefined, { default: true })` restores the default list of bootstrap peers, as seen above
- `NPP.node.config.set("Addresses.Swarm", ...` restores the default swarm addresses. You should have run this in node.js only
- `relay: { enabled: true, hop: { enabled: true, active: true } }` sets up a your node as a "circuit relay", which means that others will be able to "hop" through your node to connect to your peers, and your node will hop over others to do the same.

Again, you won't have to do either of these restorations if you're starting with a fresh IPFS repo. These instructions are just included to deepen your understanding of what's going on in the stack. We realize we've been spending a lot of time in IPFS config and IPFS commands - it's understandable, since the IPFS features form the backbone of what we're doing with OrbitDB.

> **Note:** If you experience 529 errors from the `preload.ipfs.io` servers in your console, rest assured that there is nothing wrong with your app. Those servers exist to strengthen the network and increase application performance but they are _not_ necessary. You can re-insert `preload: { enabled: false }` any time and still remain connected to the global IPFS network

### Getting a list of connected peers

Your users will want to know which users they are connected to or at the very least how many peers. You will enable that using a simple IPFS function.

Create the `getIpfsPeers` function inside of the `NewPiecePlease` class.

```diff
+ async getIpfsPeers() {
+   const peers = await this.node.swarm.peers()
+   return peers
+ }
```

Then, in your application code:

```javascript
const peers = await NPP.getPeers()
console.log(peers.length)
// 8
```

Note that this number will increase over time as your swarm automatically grows, so check and update periodically.

### Manually connecting to peers

All users will be running their own IPFS nodes either in the browser or on node.js. They'll want to connect together, so you will now allow your users to connect to other peers via their IPFS ids.

There's a number of ways to model and test this during development - you could open up two browsers, or a public and private window in the same browser. Similarly, you could run one instance of the app in node.js and the other in the browser. You should be able to connect to any of them.

Create the `connectToPeer` function inside the `NewPiecePlease` class:

```diff
+ async connectToPeer(multiaddr, protocol = "/p2p-circuit/ipfs/") {
+   try {
+     await this.node.swarm.connect(protocol + multiaddr)
+   } catch(e) {
+     throw (e)
+   }
+ }
```

Then, update the `_init` function to include an event handler for when a peer is connected:

```diff
  async _init() {
    const nodeInfo = await this.node.id()
    this.orbitdb = await OrbitDB.createInstance(this.node)
    this.defaultOptions = { accessController: { write: [this.orbitdb.identity.publicKey] }}

    const docStoreOptions = Object.assign(this.defaultOptions, { indexBy: 'hash' })
    this.pieces = await this.orbitdb.docstore('pieces', docStoreOptions)
    await this.pieces.load()

    this.user = await this.orbitdb.kvstore("user", this.defaultOptions)
    await this.user.load()

    await this.loadFixtureData({
      "username": Math.floor(Math.rand() * 1000000),
      "pieces": this.pieces.id,
      "nodeId": nodeInfo.id
    })

+   this.node.libp2p.on("peer:connect", this.handlePeerConnected.bind(this))

    if(this.onready) this.onready()
  }
```

Finally, create the a simple, yet extensible, `handlePeerConnected` function.

```diff
+ handlePeerConnected(ipfsPeer) {
+   const ipfsId = ipfsPeer.id._idB58String;
+   if(this.onpeerconnect) this.onpeerconnect(ipfsId)
+ }
```

In your application code, implement these functions like so:

```javascript
NPP.onpeerconnect = console.log
await NPP.connectToPeer("QmWxWkrCcgNBG2uf1HSVAwb9RzcSYYC2d6CRsfJcqrz2FX")
// some time later, outputs "QmWxWkrCcgNBG2uf1HSVAwb9RzcSYYC2d6CRsfJcqrz2FX"
```

#### What just happened?

You created 2 functions: one that shows a list of peers and another that lets you connect to peers via their multiaddress.

- `this.node.swarm.peers()` returns a an array of connected peers
- `protocol = "/p2p-circuit/ipfs/"` is used as a default since this is a common protocol between browser and node.js
- `this.node.swarm.connect(protocol + multiaddr)` connects to a peer via their a multiaddress that combines `protocol` and `multiaddr` into an address like `p2p-circuit/ipfs/Qm....`
- `this.node.libp2p.on("peer:connect", this.handlePeerConnected.bind(this))` registers the `handlePeerConnected` function to be called whenever a peer connects to the application node.
- `ipfsPeer.id._idB58String` is a nice, synchronous way to get the peer id.

### Peer to peer communication via IPFS pubsub

The term "pubsub" derived from "**pub**lish and **sub**scribe, and is a common messaging model in distributed systems. The idea here is that peers will "broadcast" messages to the entire network via a "topic", and other peers can subscribe to those topics and receive all the messages.

You can leverage this mechanism to create a simple communication mechanism between the user nodes.

#### Subscribing to "your" channel

Your users will need to be able to receive messages that are broadcast to them. You will enable this by having them subscribe to a topic named after their IPFS id.

Update the `_init` function to look like the following:

```diff
  async _init() {
    const nodeInfo = await this.node.id()
    this.orbitdb = await OrbitDB.createInstance(this.node)
    this.defaultOptions = { accessController: { write: [this.orbitdb.identity.publicKey] }}

    const docStoreOptions = Object.assign(this.defaultOptions, { indexBy: 'hash' })
    this.pieces = await this.orbitdb.docstore('pieces', docStoreOptions)
    await this.pieces.load()

    this.user = await this.orbitdb.kvstore("user", this.defaultOptions)
    await this.user.load()

    await this.loadFixtureData({
      "username": Math.floor(Math.rand() * 1000000),
      "pieces": this.pieces.id,
      "nodeId": nodeInfo.id
    })

    this.node.libp2p.on("peer:connect", this.handlePeerConnected.bind(this))
+   await this.node.pubsub.subscribe(nodeInfo.id, this.handleMessageReceived.bind(this))

    if(this.onready) this.onready()
  }

```

Then, add the `handleMessageReceived` function to `NewPiecePlease`

```javascript
handleMessageReceived(msg) {
  if(this.onmessage) this.onmessage(msg)
}
```

Use this in your application:

```javascript
NPP.onmessage = console.log
/* When receiving a message, it will output something like:
{
  "from": "QmVQYfz7Ksimx8a4kqWJinX9BqoiYM5BQVyoCvotVDjj6P",
  "data": "<Buffer 64 61 74 61>",
  "seqno": "<Buffer 78 3e 6b 8c fd de 5d 7b 27 ab e4 e0 c9 72 4e c0 aa ee 94 20>",
  "topicIDs": [ "QmXG8yk8UJjMT6qtE2zSxzz3U7z5jSYRgVWLCUFqAVnByM" ]
}
*/
```

Messages are sent with the data as type `Buffer` and can contain any JSON-serializable data, and can be decoded using the `msg.data.toString()` function.

#### Sending messages to peers

Now that the nodes are listening, they'll want to send messages to each other. You will enable this to  give your users the ability to send messages to each other via the pubsub topics of their IPFS ids.

Create the `sendMessage` function inside the `NewPiecePlease` class:

```diff
+ async sendMessage(topic, message, callback) {
+   try {
+     const msgString = JSON.stringify(message)
+     const messageBuffer = this.node.types.Buffer(msgString)
+     await this.node.pubsub.publish(topic, messageBuffer)
+   } catch (e) {
+     throw (e)
+   }
+ }
```

You can then utilize this function in your application code, and your user will see the output as defined in the previous subsection.

```javascript
let data // can be any JSON-serializable value
var hash = "QmXG8yk8UJjMT6qtE2zSxzz3U7z5jSYRgVWLCUFqAVnByM";
var callback = console.error
await NPP.sendMessage(hash, data, callback)
```

#### What just happened?

You enabled a simple message sending and receiving system which allows peer-to-peer communication.

- `this.node.types.Buffer(msgString)` encoded the message, after JSON stringification, into a Buffer object.
- `this.node.pubsub.publish(topic, messageBuffer)` sends the encoded Buffer to the topic specified. In our case, this will be the IPFS id

> **Note:** These techniques presented for _educational purposes only_, with no consideration as to security or privacy. You should be encrypting and signing messages at the application level. More on this in Chapter 6 of the tutorial.

### Key Takeaways

- In order to do anything peer-to-peer, you will need to be connected to the global IPFS network
- If you started offline, the default configuration is restorable
- Your node announces itself to the network via its _swarm_ addresses
- Your node will connect to _bootstrap_ peers automatically, and you can manually connect to peers on command
- Peer-to-peer communication is achieved through a "pubsub" model
- In pubsub, users subscribe to, and broadcast messages to, "topics"

<strong>Now, move on to [Chapter 05 - Peer to Peer Part 2](./05_P2P_Part_2.md)</strong>

- Resolves #[463](https://github.com/orbitdb/orbit-db/issues/463)
- Resolves #[468](https://github.com/orbitdb/orbit-db/issues/468)
- Resolves #[471](https://github.com/orbitdb/orbit-db/issues/471)
- Resolves #[498](https://github.com/orbitdb/orbit-db/issues/498)
- Resolves #[519](https://github.com/orbitdb/orbit-db/issues/519)
- Resolves #[296](https://github.com/orbitdb/orbit-db/issues/296)
- Resolves #[264](https://github.com/orbitdb/orbit-db/issues/264)
- Resolves #[460](https://github.com/orbitdb/orbit-db/issues/460)
- Resolves #[484](https://github.com/orbitdb/orbit-db/issues/484)
- Resolves #[474](https://github.com/orbitdb/orbit-db/issues/474)
- Resolves #[505](https://github.com/orbitdb/orbit-db/issues/505)
- Resolves #[496](https://github.com/orbitdb/orbit-db/issues/496)
