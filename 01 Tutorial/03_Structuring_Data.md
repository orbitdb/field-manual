**Note:** Please complete [Chapter 2 - Managing Data](./02_Managing_Data.md) first. 

# Chapter 3 - Structuring your data

> Or, How I learned to stop worrying and learned to love _nested databases_

- [Adding a practice counter to each piece](#)
- [Adding a higher-level user database](#)

> **Note:**  The nesting approach detailed here is but one of many, and you are free to organize your data as you see fit. This is a powerful feature of OrbitDB and we are excited to see how people tackle this problem in the future!

## Adding a practice counter to each piece

Your users may want to keep track of their practice, at minimum how many times they practiced a piece. You'll enable that functionality for them.

You'll remember in the previous chapter we duplicated some code between `addNewPiece` and `updatePieceByHash`. You can now take advantage of this by creating a new OrbitDB `counter` store for each piece, and creating a few new functions inside the `NewPiecePlease` class to interact with the counters.

We will still utilize basic access control to ensure that only a node with your IPFS node's ID can write to it.

```
async addNewPiece(hash, instrument = "Piano") {
  const counterDb = await this.orbitdb.counter
  const cid = await this.piecesDb.put({ hash: hash, instrument: instrument })
  return cid
}
```

> **Note:** There is a limit of 40 characters on the names of the databases, and multihashes are over this limit at 46. We still need unique names for each of the databases created to generate unique addresses, so we trim down the hash and prepend
it with `counter.` to get around this limitation.

### What just happened?

You changed your code to add a new database of type `counter` for each entry added to the database.

* `this.orbitdb.counter` creates a new counter type with `options` that provide a write ACL for your IPFS node
* `this.piecesDb.put` is modified to store the _address_ of this new database for later retrieval similar to the way you  stored media addresses in a previous chapter.

## Adding a higher-level database for user data

Pieces of music to practice with are great to have, but moving forward you will want to allow users to further express themselves via a username and profile. This will also help prepare you for allowing users to connect to each other in the next chapter.

You will create a new database for users, from which your `piecesDb` will be referenced. 

```javascript
```

## Key Takeaways

* The distributed applications of the future will be complex and require data structures to mirror and manage that complexity.
* Luckily, OrbitDB is extremely flexible when it comes to generating complex and linked data structures 
* You can nest a database within another, and you can create new databases to next your existing databases within.
* _Nesting_ databases is a powerful approach, but it is one of many. **Do not** feel limited. **Do** share novel approaches with the community.

And with this, you are now ready to connect to the outside world. Continue to [Chapter 4: Peer to Peer])[04_P2P.md] to join your app to the global IPFS network, and to other users! 
