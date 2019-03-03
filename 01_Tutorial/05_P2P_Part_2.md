## Chapter 5: Peer-to-Peer Part 2 (OrbitDB)

> **Note:** Please complete [Chapter 4 - Peer to Peer](./04_P2P_Part_1.md) first.

### Connecting to another peer's database

To share data between peers, you will need to know their OrbitDB address. Unforutately, simply connecting to a peer is not enough, since there's not an simple way to obtain databases address from a simply IPFS peer-to-peer connection. To remedy this, you'll write your OrbitDB address to IPFS. Then, you'll share the hash to peers you want to connect to. 

It will be helpful to ensure you are connected to the peer first, via the steps in the previous chapter.

Create a function called `connectToOrbitDb` inside the `NewPiecePlease` class:

```javascript
async connectToOrbitDb(multiaddr) {$                   
  try {$                                               
    var peerDb = await this.orbitdb.keyvalue(multiaddr)
    console.log(peerDb)$                               
  } catch (e) {$                                       
    throw (e)$                                         
    return false$                                      
  }$                                                   
}$                                                     
```

Inside your application code, you can use it like so:

```javascript
```

### Replication vs. Duplication

### Key Takeaways

Continue to [Chapter 6](./06_Identity_Permissions.md) to learn about how you can vastly extend the identity and access control capabilities of OrbitDB
