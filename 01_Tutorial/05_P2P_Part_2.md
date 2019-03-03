## Chapter 5: Peer-to-Peer Part 2 (OrbitDB)

> **Note:** Please complete [Chapter 4 - Peer to Peer](./04_P2P_Part_1.md) first.

### Connecting to another peer's database

Once you're connected to the relevant peer, next you'll want to find their user database. You'll do so now by

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
