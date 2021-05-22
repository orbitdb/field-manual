## Chapter 2 - Managing Data

> Managing data in OrbitDB involves  _loading databases into memory_ and then _creating_, _updating_, _reading_, and _deleting data_.

<div>
  <h3>Table of Contents</h3>

Please complete [Chapter 1 - Laying the Foundation](./01_Basics.md) first.

- [Loading the database](#loading-the-database)
- [Adding data](#adding-data)
- [Reading data](#reading-data)
- [Updating and deleting data](#updating-and-deleting-data)
- [Storing media files](#storing-media-files)
- [Key takeaways](#key-takeaways)

</div>

### Loading the database

The first thing your users will want is to make sure that when they load the app, their data is available. You will do so easily by loading the database contents into memory.

Update your `NewPiecePlease class` handler, adding **one line** at the bottom of the IPFS `ready` handler:

```diff
  async _init () {
    this.orbitdb = await OrbitDB.createInstance(this.node)
    this.defaultOptions = { accessController: { write: [this.orbitdb.identity.id] }}

    const docStoreOptions = {
      ...this.defaultOptions,
      indexBy: 'hash',
    }
    this.pieces = await this.orbitdb.docstore('pieces', docStoreOptions)
+   await this.pieces.load()

    this.onready()
  }
}
```

#### What just happened?

After you instantiated the database you loaded its contents into memory for use. It is empty for now, but not for long! Loading the database at this point after instantiation will save you trouble later.

- `await pieces.load()` is a function that will need to be called whenever we want the latest and greatest snapshot of data in the database. The `load` function retrieves all of the values via their _content addresses_ and loads the content into memory.

> **Note:** You are probably wondering about if you have a large database of millions of documents, and the implications of loading them all into memory. It is a valid concern, and you should move on to Part 4 of this book once you are done with the tutorial.

### Adding data

Next, your users will want to be able to add sheet music to their catalog. You will use functions exposed from OrbitDB's `keyvalue` store now.

Add a function called `addNewPiece` function now, with some commented out functions we'll use later.

```diff
+ async addNewPiece(hash, instrument = 'Piano') {
+   // const existingPiece = this.getPieceByHash(hash)
+   if (existingPiece) {
+     // await this.updatePieceByHash(hash, instrument)
+     return
+   }
+
+   const cid = await this.pieces.put({ hash, instrument })
+   return cid
+ }
```

We have uploaded and pinned a few piano scores to IPFS, and will provide the hashes. You can add these hashes to your database by fleshing out and using the `addNewPiece` function.

In your application code, Node.js or browser, you can use this function like so, utilizing the default value for the `instrument` argument.

```JavaScript
const cid = await NPP.addNewPiece("QmNR2n4zywCV61MeMLB6JwPueAPqheqpfiA4fLPMxouEmQ")
const content = await NPP.node.dag.get(cid)
console.log(content.value.payload)
```

Running this code should give you something like the following output. Hold steady, it is overwhelming but it will make sense after we explain what happened. For more information see Part 3, The Architecture of OrbitDB.

```json
{
  "op":"PUT",
  "key":"QmNR2n4zywCV61MeMLB6JwPueAPqheqpfiA4fLPMxouEmQ",
  "value": {
    "hash":"QmNR2n4zywCV61MeMLB6JwPueAPqheqpfiA4fLPMxouEmQ",
    "instrument":"Accordion"
  }
}
```

> **Note:** We hope you like the original Metroid NES game, or at least the music from it! All music Copyright © Nintendo.

#### What just happened?

You wrote and tested a function that allows users to add new sheet music to the database.

- `pieces.put({ ... })` is the most important line here. This call takes an object to store and returns a _multihash_, which is the hash of the content added to IPFS.
- `node.dag.get(hash)` is a function that takes a CID and returns content.
- `"op": "PUT"` is a notable part of the output. At the core of OrbitDB databases is the **OPLOG**, where all data are stored as a log of operations, which are then calculated into the appropriate schema for application use. The operation is specified here as a `PUT`, and the `key`/`value` pair is your data.

> **Note:** "dag" in the code refers to the acronym DAG, which stands for Directed Acyclic Graph. This is a data structure that is closely related to blockchain.

You can repeat this process to add more hashes from the NES Metroid soundtrack:

```plain
QmNR2n4zywCV61MeMLB6JwPueAPqheqpfiA4fLPMxouEmQ | Metroid - Ending Theme.pdf
QmRn99VSCVdC693F6H4zeS7Dz3UmaiBiSYDf6zCEYrWynq | Metroid - Escape Theme.pdf
QmdzDacgJ9EQF9Z8G3L1fzFwiEu255Nm5WiCey9ntrDPSL | Metroid - Game Start.pdf
QmcFUvG75QTMok9jrteJzBUXeoamJsuRseNuDRupDhFwA2 | Metroid - Item Found.pdf
QmTjszMGLb5gKWAhFZbo8b5LbhCGJkgS8SeeEYq3P54Vih | Metroid - Kraids Hideout.pdf
QmNfQhx3WvJRLMnKP5SucMRXEPy9YQ3V1q9dDWNC6QYMS3 | Metroid - Norfair.pdf
QmQS4QNi8DCceGzKjfmbBhLTRExNboQ8opUd988SLEtZpW | Metroid - Ridleys Hideout.pdf
QmcJPfExkBAZe8AVGfYHR7Wx4EW1Btjd5MXX8EnHCkrq54 | Metroid - Silence.pdf
Qmb1iNM1cXW6e11srUvS9iBiGX4Aw5dycGGGDPTobYfFBr | Metroid - Title Theme.pdf
QmYPpj6XVNPPYgwvN4iVaxZLHy982TPkSAxBf2rzGHDach | Metroid - Tourian.pdf
QmefKrBYeL58qyVAaJoGHXXEgYgsJrxo763gRRqzYHdL6o | Metroid - Zebetite.pdf
```

These are all stored in the global IPFS network so you can find any piece by visiting a public gateway such as `ipfs.io` and adding the IPFS multiaddress to the end of the URL like so: [https://ipfs.io/ipfs/QmYPpj6XVNPPYgwvN4iVaxZLHy982TPkSAxBf2rzGHDach](https://ipfs.io/ipfs/QmYPpj6XVNPPYgwvN4iVaxZLHy982TPkSAxBf2rzGHDach)

### Reading data

Of course, your users will want to read their data after creating it, so you will enable that functionality now. OrbitDB gives you a number of ways to do this, mostly based on which _store_ you picked.

We gave you a `docstore` earlier, so you can write some simple `get*` functions like so. `docstore` also provides the more powerful `query` function, which we can abstract to write a `getPiecesByInstrument` function:

Fill in the following functions now:

```diff
+ getAllPieces() {
+   const pieces = this.pieces.get('')
+   return pieces
+ }
```

```diff
+ getPieceByHash(hash) {
+   const singlePiece = this.pieces.get(hash)[0]
+   return singlePiece
+ }
```

```diff
+ getPieceByInstrument(instrument) {
+   return this.pieces.query((piece) => piece.instrument === instrument)
+ }
```

and uncomment them from `addNewPiece`:

```diff
+ async addNewPiece(hash, instrument = 'Piano') {
-   // const existingPiece = this.getPieceByHash(hash)
+   const existingPiece = this.getPieceByHash(hash)
+   if (existingPiece) {
-     // await this.updatePieceByHash(hash, instrument)
+     await this.updatePieceByHash(hash, instrument)
+     return
+   }
+
+   const cid = await this.pieces.put({ hash, instrument })
+   return cid
+ }
```

In your application code, you can use these functions like so:

```JavaScript
pieces = NPP.getAllPieces()
pieces.forEach((piece) => { /* do something */ })

piece = NPP.getPieceByHash('QmNR2n4zywCV61MeMLB6JwPueAPqtheqpfiA4fLPMxouEmQ')
console.log(piece)
```

Pulling a random score from the database is a great way to find random music to practice. Run this code:

```JavaScript
const pieces = NPP.getPieceByInstrument("Piano")
const randomPiece = pieces[pieces.length * Math.random() | 0]
console.log(randomPiece)
```

Both `console.log` calls above will return something like this:

```json
{
  "hash":"QmNR2n4zywCV61MeMLB6JwPueAPqheqpfiA4fLPMxouEmQ",
  "instrument":"Accordion"
}
```

#### What just happened?

You queried the database of scores you created earlier in the chapter, retrieving by hash and also randomly.

- `pieces.get(hash)` is a simple function that performs a partial string search on your database indexes. It will return an array of records that match. As you can see in your `getAllPieces` function, you can pass an empty string to return all pieces.
- `return this.pieces.query((piece) => piece.instrument === instrument)` queries the database, returning. It's most analogous to JavaScripts `Array.filter` method.

> **Note:** Generally speaking, `get` functions do not return promises since the calculation of database state happens at the time of a _write_. This is a trade-off to allow for ease of use and performance based on the assumption that writes are _generally_ less frequent than reads.

### Updating and deleting data

Next, you will want to provide your users with the ability to update and delete their pieces. For example, if you realize you would rather practice a piece on a harpsichord instead of a piano, or if they want to stop practicing a certain piece.

Again, each OrbitDB store may have slightly different methods for this. In the `docstore` you can update records by again using the `put` method and the ID of the index you want to update.

Fill in the `updatePieceByHash` and `deletePieceByHash` functions now:

```diff
+ async updatePieceByHash (hash, instrument = 'Piano') {
+   const piece = await this.getPieceByHash(hash)
+   piece.instrument = instrument
+   const cid = await this.pieces.put(piece)
+   return cid
+ }
```

```diff
+ async deletePieceByHash (hash) {
+   const cid = await this.pieces.del(hash)
+   return cid
+ }
```

In your application code, you can run these new functions and see the opcodes that return to get a sense of what is going on.

```JavaScript
const cid = await NPP.updatePiece("QmNR2n4zywCV61MeMLB6JwPueAPqheqpfiA4fLPMxouEmQ", "Harpsichord")
// do stuff with the cid as above

const cid = await NPP.deletePieceByHash("QmNR2n4zywCV61MeMLB6JwPueAPqheqpfiA4fLPMxouEmQ")
const content = await NPP.node.dag.get(cid)
console.log(content.value.payload)
```

While the opcode for PUT will be the same, the opcode for `deletePieceByHash` is not:

```json
{
  "op":"DEL",
  "key":"QmdzDacgJ9EQF9Z8G3L1fzFwiEu255Nm5WiCey9ntrDPSL",
  "value":null
}
```

#### What just happened?

You may be thinking something like this: "Wait, if OrbitDB is built upon IPFS and IPFS is immutable, then how are we updating or deleting records?" Great question, and the answer lies in the opcodes  Let us step through the code so we can get to that.

- `this.pieces.put` is nothing new, we are just using it to perform an update instead of an insert
- `this.pieces.del` is a simple function that takes a hash, deletes the record, and returns a CID
- `"op": "DEL"` is another opcode, `DEL` for DELETE. This log entry effectively removes this key from your records and also removes the content from your local IPFS

### Storing Media Files

Your users will probably not want to mess with content hashes, so you will want to provide them the ability to add files directly to IPFS. This section shows how you will be able to do this, and then store the _address_ of the file in OrbitDB.

The overall pattern is:

1. Add the file to IPFS, which will return the _multihash_ of the file
2. Store said multihash in OrbitDB
3. When it comes time to display the media, use native IPFS functionality to retrieve it from the hash

#### Adding content to IPFS

To see this in action, [download the "Tourian" PDF](https://ipfs.io/ipfs/QmYPpj6XVNPPYgwvN4iVaxZLHy982TPkSAxBf2rzGHDach) to your local file system for use in the next examples

##### On the command line with the go-ipfs or js-ipfs daemon

After following the installation instructions to install [go-ipfs](https://github.com/ipfs/go-ipfs) or [js-ipfs](https://github.com/ipfs/js-ipfs) globally, you can run the following command:

```bash
$ ipfs add file.pdf
QmYPpj6XVNPPYgwvN4iVaxZLHy982TPkSAxBf2rzGHDach
```

You can then use that hash in the same manner as above to add it to the database of pieces.

##### In Node.js

In Node.js, adding a file from the filesystem can be accomplished like so:

```JavaScript
var IPFS = require('ipfs')
var ipfs = new IPFS(/* insert appropriate options here for your local IPFS installation */)

ipfs.addFromFs("./file.pdf").then(console.log)
```

##### In the browser

If you have a HTML file input with an ID of "fileUpload", you can do something like the following to add content to IPFS:

```JavaScript
document.getElementById("fileUpload").addEventListener('change', async (event) => {
  const file = event.target.files[0]
  if (file) {
    const result = await NPP.node.add(file)
    const cid = await NPP.addNewPiece(result[0].hash)
  }
})
```

Note that there are still issues with swarming in the browser, so you may have trouble discovering content. Stay tuned for future `js-ipfs` releases to fix this.

#### What just happened?

You added some potentially very large media files to IPFS, and then stored the 40-byte addresses in OrbitDB for retrieval and use. You are now able to leverage the benefits of both IPFS and OrbitDB in both the browser and Node.js.

> **Note:** IPFS nodes run _inside_ the browser, so if you're adding lots of files via the above method, keep an eye on your IndexedDB quotas, since that's where IPFS is storing the blocks.

### Key takeaways

- Calling `load()` periodically ensures you have the latest entries from a local database available in memory
- Generally speaking, a `put` or `delete` will return a Promise (or require `await`), and a `get` will return the value(s) immediately.
- Updating the database is equivalent to adding a new entry to its OPLOG.
- The OPLOG is calculated to give the current _state_ of the database, which is the view you generally interact with
- OPLOGS are flexible, particularly if you're writing your own stores. `docstore` primarily utilizes the `PUT` and `DEL` opcodes
- While you technically _can_ store encoded media directly in a database, media files are best stored in OrbitDB as IPFS hashes
- Keep an eye on IndexedDB size and limitations when adding content to IPFS via the browser.

<strong>Of course, in the vast majority of apps you create, you won't just be interacting with one database or one type of data. We've got you covered in [Chapter 3: Structuring Data](03_Structuring_Data.md)</strong>

- Resolves #[365](https://github.com/orbitdb/orbit-db/issues/365)
- Resolves #[438](https://github.com/orbitdb/orbit-db/issues/438)
- Resolves #[381](https://github.com/orbitdb/orbit-db/issues/381)
- Resolves #[242](https://github.com/orbitdb/orbit-db/issues/242)
- Resolves #[430](https://github.com/orbitdb/orbit-db/issues/430)
