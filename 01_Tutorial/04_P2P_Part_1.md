## Chapter 4: Peer-to-Peer, Part 1 (The IPFS Layer)

> There's a lot of ground to cover as we move from offline to fully peer-to-peer, and we need to start where it starts: _connecting to IPFS_, _connecting directly to peers_, and _communicating with them via IPFS pubsub._

<div>
  <h3>Table of Contents</h3>

Please complete [Chapter 3 - Structuring Data](./03_Structuring_Data.md) first.

- [Connecting to the global IPFS network](#connecting-to-the-global-ipfs-network)
- [Getting a list of connected peers](#getting-a-list-of-connected-peers)
- [Manually connecting to peers](#manually-connecting-to-peers)
- [Peer to peer communication via IPFS pubsub](#peer-to-peer-communication-via-IPFS-pubsub)

</div>

### Connecting to the global IPFS network

You will now reconfigure your IPFS node to connect to the global network and begin swarming with other peers. For more information on what this means, see Part 2 - Thinking Peer to Peer. For now, just understand that it means you're getting connected.

#### Restoring default IPFS config values

> **Note:** Bootstrap peers are important because... TODO

We purposefully started offline, but now we're going to want to get connected - 

This is because bootstrap and swarm values are persisted in your IPFS config. This is located in the filesystem in the case of node.js and in IndexedB in the case of the browser. You should not manually edit these files.

However, nothing will change yet when you run the app. What you _can_ do is run the you should see some messages in your console, something like:

#### Restoring your default bootstrap peers

We started the tutorial offline to focus on OrbitDB's core concepts. Now you'll undo this and connect the app, properly, to the global IPFS network.

Update the `NewPiecePlease` constructor like so:

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

Now, you can either delete your data, by deleting the `ipfs` and `orbitdb` folders in node.js, or by clearing your local data in the browser, or you can restore locally.

If you don't want to blow away your data, then you can manually restore your bootstrap peers.

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

Next, you will restore your default swarm addresses. These are adresses that your node announces itself to the world on.

Luckily, in the browser you don't have to do anything, the default is an empty array. You should already see something like this in your console:

```plain
Swarm listening on /p2p-circuit/ipfs/QmWxWkrCcgNBG2uf1HSVAwb9RzcSYYC2d6CRsfJcqrz2FX
Swarm listening on /p2p-circuit/p2p-websocket-star/ipfs/QmWxWkrCcgNBG2uf1HSVAwb9RzcSYYC2d6CRsfJcqrz2FX
```

In node.js, run this command: 

```javascript
NPP.node.config.set("Addresses.Swarm", ['/ip4/0.0.0.0/tcp/4002', '/ip4/127.0.0.1/tcp/4003/ws'], console.log)
```

Again, you won't have to do either of these restorations if you're starting with a fresh IPFS repo. These instructions are just included to deepen your understanding of what's going on in the stack.

Restart your app you'll see the console output confirming you're swarming. In node.js you'll see something like:

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

You'll see a list of addresses your node is publishing on. Expect the browser to have only 2, and node.js to have more. Since we're dealing with both node.js and the browser, we will use the addresses starting with `p2p-circut`.

#### What just happened?

Before this, you were working offline. Now you're not. You've been connected to the global IPFS network and are ready for peer to-peer connections.

- Removing `preload: { enabled: false }` enables connection to the bottom two nodes from the above bootstrap list.
- Removing `config: {  Bootstrap: [], Addresses: { Swarm: [] } }` will prevent thie storing of empty arrays in your config files for the `Bootstrap` and `Addresses.Swarm` config keys
- `this.node.bootstrap.add(undefined, { default: true })` restores the default list of bootstrap peers, as seen above
- `NPP.node.config.set("Addresses.Swarm", ...` restores the default swarm addresses. You should have run this in node.js only
- `relay: { enabled: true, hop: { enabled: true, active: true } }` sets up a your node as a "circut relay", which means that others will be able to "hop" through your node to connect to your peers, and your node will hop over others to do the same.

We realize we've been spending a lot of time in IPFS config and IPFS commands - it's understandable, since the IPFS features form the backbone of what we're doing with OrbitDB. 

> **Note:** If you experience 529 errors from the `preload.ipfs.io` servers in your console, rest assured that there is nothing wrong with your app. Those servers exist to strengthen the network and increase application performance but they are _not_ necessary. You can re-insert `preload: { enabled: false }` any time and still remain connected to the global IPFS network

### Getting a list of connected peers

First, create the `getIpfsPeers` function inside of the `NewPiecePlease` class.

```javascript
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

Note that this number will increase over time as your swarm automatically grows.
 
#### Connecting to peers

Next, you'll allow your users to connect to other peers via their _multiaddresses_.

> **Note:** There's a number of ways to model and test this during development - you could open up two browsers, or a public and private window in the same browser. Similarly, you could run one instance of the app in node.js and the other in the browser. You should be able to connect to all.

You can now enable peer connection by adding this function to the `NewPiecePlease` class:

```javascript
+ async connectToPeer(multiaddr) {
+   try {
+     await this.node.swarm.connect(multiaddr)
+   } catch(e) {
+     throw (e)
+   }
+ }
```

Then, update the `_init_` function to include an event handler for when a peer is connected:

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

Finally, create the a simple, yet extensible, `peerConnected` function.

```diff
+ async peerConnected(ipfsPeer) {
+   const ipfsId = ipfsPeer.id._idB58String;
+   if(this.onpeerconnect) this.onpeerconnect(ipfsPeer)
+ }
``

In your application code, implement these functions like so:

```javascript
NPP.onpeerconnected = console.log
await NPP.connectToPeer("/p2p-circuit/ipfs/QmWxWkrCcgNBG2uf1HSVAwb9RzcSYYC2d6CRsfJcqrz2FX")
// some time later, outputs "QmZg8h94DAmWozqA8nqKttCFrFeaxRDSazHGCgc8fzkiJS"
```

#### What just happened?

You created 2 functions: one that shows a list of peers and another that lets you connect to peers via their multiaddress.

- blahblah

### Peer to peer communication via IPFS pubsub

The term "pubsub" derived from "publish" and "subscribe", and is a common messaging model in distributed systems. The idea here is that peers will "broadcast" messages to the entire network via a "topic", and other peers can subscribe to those topics and receive all the messages. You can leverage the underlying IPFS pubsub infrastructure to create a simple communication mechanism between the user nodes.

#### Subscribing to "your" channel

First, you'll add some code to allow you to subscribe to a channel. Channels have names, and in this case you'll just use the node ID.

Update the `ready` handler in the `NewPiecePlease` constructor to look like the following:

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

Then, add the `onmessage` and `sendMessage` function to `NewPiecePlease`

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

#### Sending messages to peers

Next you'll give your users the ability to send messages to each other via those pubsub topics.

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

You can then utilize this function in your application code, and your user will see the output as defined above.

```javascript
let data // can be any JSON-serializable value
var hash = "QmXG8yk8UJjMT6qtE2zSxzz3U7z5jSYRgVWLCUFqAVnByM";
var callback = console.error
await NPP.sendMessage(hash, data, callback)
```

#### What just happened?

> **Note:** These techniques presented for _educational purposes only_, with no consideration as to security or privacy. You should be encrypting and signing messages at the application level. More on this in Chapter 6 of the tutorial.

### Key Takeaways

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

Now, move on to [Chapter 05 - Peer to Peer Part 2](./05_P2P_Part_2.md)
