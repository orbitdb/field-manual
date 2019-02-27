**Note:** Please complete [Chapter 1 - Laying the Foundation](./01_Basics.md) first. 

# Chapter 2 - Managing Data

> Managing data in OrbitDB involves  _loading databases into memory_, and then _creating_, _updating_, _reading_, and _deleting data_.

- [Loading the database](#loading-the-database)
- [Adding data](#adding-data)
- [Reading data](#reading-data)
- [Updating and deleting data](#updating-and-deleting-data)
- [Storing media files](#storing-media-files)

## Loading the database

To start, you'll do a couple of things to enhance our current code and tidy up. We will also scaffold out some functions to be filled in later.

Update your `NewPiecePlease class` handler, adding **one line** at the bottom of the IPFS `ready` handler. and then run this code:

```javascript
class NewPiecePlease {
  constructor (IPFS, OrbitDB) {
    this.node = new IPFS({
      preload: { enabled: false },
      EXPERIMENTAL: { pubsub: true },
      repo: "./ipfs",
      config: { 
        Bootstrap: [],
        Addresses: { Swarm: [] }
      }
    });

    this.node.on("error", (e) => console.error)
    this.node.on("ready", async () => {
      this.orbitdb = await OrbitDB.createInstance(this.node)

      const options = {
        accessController: { write: [this.orbitdb.identity.publicKey] },
        indexBy: 'hash'
      }

      this.piecesDb = await this.orbitdb.docstore('pieces', options)
      await this.piecesDb.load()  // It's only this line that changed!! Blink and you'll miss it
    });
  }

  async addNewPiece() { }
  deletePiece(hash) { }
  getPiece(query) { }
}

```

### What just happened?

After you instantiated the database, you loaded its contents into memory for use. It's empty for now, but not for long! Loading the database at this point after instantiation will save you trouble later.

* `await piecesDb.load()` is a function that will need to be called whenever we want the latest and greatest snapshot of data in the database. `load()` retrieves all of the values via their _content addresses_ and loads the content into memory

> **Note:** You're probably wondering about if you have a large database of millions of documents, and the implications of loading them all into memory. It's a valid concern, and you should move on to Part 4 of this book once you're done with the tutorial.

## Adding data

Now that you have a database set up, adding content to it is fairly easy. Run the following code to add some sheet music to the repository.

We have uploaded and pinned a few piano scores to IPFS, and will provide the hashes. You can add these hashes to your database by fleshing out and using the `addNewPiece` function.

> **Note:** We hope you like the original Metroid game, or at least the music from it!

```javascript
async addNewPiece(hash, instrument = "Piano") {
  const cid = await piecesDb.put({ hash, instrument })
  return cid
}
```

Then, in your application code, node.js or browser, you cna use this function like so, utilizing the detault value for the `instrument` argument.

```javascript
const newPieceHash = NPP.addNewPiece("QmNR2n4zywCV61MeMLB6JwPueAPqheqpfiA4fLPMxouEmQ")
const content = await node.dag.get(hash)
console.log(content.value.payload)
```

Running this code should give you something like the following output. Hold steady, it's overwhelming but it will make sense 
after we explain what happened. For more information see Part 3.

```json
{
  "op":"PUT",
  "key":1551137682387,
  "value":  {
    "address":"12345",
    "instrument":"Accordion"
  }
}
```
### What just happened?

* `piecesDb.put({ ... })` is the primary. This call returns a _mutlihash_, which is the hash of the content added to IPFS. 
* `node.dag.get(hash)` is a function that takes a Content ID (CID) and returns content. 

> **Note:** "dag" in the code refers to the acronym DAG, which stands for Directed Acyclic Graph. This is a data structure that is, or is at least closely related to Blockchain. More on this in Part 4

* `"op": "PUT"`is a notable part of the output. At the core of OrbitDB databases is the **OPLOG**, where all data are stored as a log of operations, which are then calculated into the appropriate schema for application use. The operation is specified here as a `PUT`, and then the `key`/`value` pair is your data.

You can repeat this process to add more hashes from the NES Metroid soundtrack:

```
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
## Reading data

You've added data to your local database, and now you'll can query it. OrbitDB gives you a number of ways to do this, mostly based on which _store_ you picked.

We gave you a `docstore` earlier, so you can flesh out the simple `getPiece` function like so:

```javascript
const singlePiece = pieces.get('Qmz...')[0]
console.log(singlePiece)
```

You'll see this output:

```json
{ }
```

Pulling a random score from the database is a great way to see this in action. Run this code:

```javascript

const pieces = piecesDb.query((piece) => piece.instrument === formData.get('instrument'))
const randomPiece = pieces[items.length * Math.random() | 0]
console.log(randomPiece)
```

You'll see a similar output to above but with a random piece from the database.

### What Just Happened

You queried the database of scores you created earlier in the chapter, retrieving by hash and also randomly.

* `pieces.get('Qmz...')` is a simple function that performs a full-text search on your database based on a string that you pass. It will return an array of records that match.
* `pieces = piecesDb.get('')` is the same function, but in this case we pass an empty string to return all records.

> **Note:** The OrbitDB docstore is surprisingly powerful. You can read more about how to use it in its [documentation].


## Updating and deleting data

Each store will ahve its own method of doing so, but in the docstore you can update records by using the `put` method and the ID of the index you want to update:

For example if you realize you'd rather practice a piece on a Harpsichord instead of a piano:

```javascript
await piecesDb.put({
  hash: "Qm...",
  instrument: "Piano"
})
```

In the docstore, deleting a record is easy, and done so via the index:

```javascript
piecesDb.del("Qm.....")
```

### What just happened?

You may be thinking something like this: "Wait, if OrbitDB is built upon IPFS and IPFS is immutable, then how are we updating or deleting records?" Great question

TODO: Explanation

## Storing Media Files

We are often asked if it is possible to store media files like pictures or audio directly inside OrbitDB. Our answer is that you should treat this like any other database system and store the _address_ of the 

Luckily, with content addressing in IPFS, this becomes rather easy, and predictable from a schema design standpoint. The overall pattern in:

1. Add the file to IPFS, which will return the _multihash_ of the file
2. Store said multihash in OrbitDB 
3. When it comes time to display the media, use native IPFS functionality to retrieve it from the hash

### Adding Content to IPFS

Assuming you have a `file.pdf` you want to add to IPFS, you have several options. You'll be free to chose whichever one works for you.

#### On the command line with go-ipfs or js-ipfs

After following the installation instructions to install [go-ipfs]() or [js-ipfs]() globally, run the following command:
 
```bash
$ ipfs add file.pdf # sometimes jsipfs add file.pdf
Qm.....
```

You can then use that hash in the same manner as above to add it to the database of pieces.

#### In Node.js

In Node.JS, adding a file from the filesystem can be accomplished like so:

```javascript
var IPFS = require('ipfs')
var ipfs = new IPFS(/* insert appropriate options here for your local IPFS installation */)

ipfs.addFromFs("./file.pdf").then(console.log)
```

#### In the browser

Unfortunately we don't have a one-line trick to upload a file to IPFS, but if you have a HTML file input with an ID of "fileUpload", you can do the following:

```javascript
var fileInput = document.getElementById("fileUpload")
```

### What just happened?


## Key Takeaways

* OrbitDB supports many schemas and APIs for interacting with data. This functionality is managed in what are called **stores**.
* OrbitDB comes with a handful of stores, and you can write your own.
* Each store will have its own API, but you will generally have at least a `get` and a `put`
* Call `load()` periodically to make sure you have the latest entries from the database
* While you technically _can_ store encoded media directly in a database, media files are best stored in OrbitDB as IPFS hashes

<p></p>

* Resolves #[365](https://github.com/orbitdb/orbit-db/issues/365) 
* Resolves #[438](https://github.com/orbitdb/orbit-db/issues/438)
* Resolves #[381](https://github.com/orbitdb/orbit-db/issues/381)
* Resolves #[242](https://github.com/orbitdb/orbit-db/issues/242)
* Resolves #[430](https://github.com/orbitdb/orbit-db/issues/430)
