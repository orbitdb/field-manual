**Note:** Please complete [Chapter 1 - Laying the Foundation](./01_Basics.md) first. 

# Chapter 2 - Managing Data

> Managing data in OrbitDB involves _choosing the appropriate data stores_, _loading databases into memory_, and _creating, updating, reading, and deleting data_.

## Choosing a Data Store

OrbitDB organizes its functionality by separating different data management concerns, schemas and APIs into **stores**. We chose a `docstore` for you in the last chapter, but after this tutorial it will be your job to determine the right store for the job.

At your disposal you have:

- **[log](https://github.com/orbitdb/orbit-db/blob/master/API.md#orbitdblognameaddress)**: an immutable (append-only) log with traversable history. Useful for *"latest N"* use cases or as a message queue.
- **[feed](https://github.com/orbitdb/orbit-db/blob/master/API.md#orbitdbfeednameaddress)**: a mutable log with traversable history. Entries can be added and removed. Useful for *"shopping cart"* type of use cases, or for example as a feed of blog posts or "tweets".
- **[keyvalue](https://github.com/orbitdb/orbit-db/blob/master/API.md#orbitdbkeyvaluenameaddress)**: a key-value database just like your favourite key-value database.
- **[docs](https://github.com/orbitdb/orbit-db/blob/master/API.md#orbitdbdocsnameaddress-options)**: a document database to which JSON documents can be stored and indexed by a specified key. Useful for building search indices or version controlling documents and data.
- **[counter](https://github.com/orbitdb/orbit-db/blob/master/API.md#orbitdbcounternameaddress)**: Useful for counting events separate from log/feed data.

Each OrbitDB store has its own specific API methods to create, delete, retreieve and update data. In general, you can expect to always have something like a `get` and something like a `put`. 

Also, users of OrbitDB can write their own stores if it suits them. This is an advanced topic and is covered in Part 3 of this book.

## Getting Started

To start, you'll do a couple of things to enhance our current code and tidy up.

Update your `ipfs.on("ready"...` handler from earlier and then run this code:

```javascript
node.on("ready", async () => {
  orbitdb = await OrbitDB.createInstance(node)

  const options = {
    accessController: { write: [orbitdb.identity.publicKey] },
    indexBy: "hash"
  }
  piecesDb = await orbitdb.docstore('pieces', options)
  await piecesDb.load()
})$                                                   
```

### What just happened?

* `await piecesDb.load()` is a function that will need to be called whenever we want the latest and greatest snapshot of data in the database. `load()` retrieves all of the values via their _content addresses_ and loads the content into memory

> **Note:** You're probably wondering about if you have a large database of millions of documents, and the implications of loading them all into memory. It's a valid concern, and you should move on to Part 4 of this book once you're done with the tutorial.

## Adding data to our database

Now that you have a database set up, adding content to it is fairly easy. Run the following code to add some sheet music to the repository.

We have uploaded and pinned a few piano scores to IPFS, and will provide the hashes here:

```javascript
const hash = await piecesDb.put({
  hash: "",
  instrument: "Piano"
})

// repeat with these hashes if you want:
// Qmz...........
// Qmz...........
// Qmz...........
// Qmz...........

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

> **Note:** "dag" is code for the acronym DAG, which stands for Directed Acyclic Graph. This is a data structure that is, or is at least closely related to Blockchain. More on this in Part 4

## Reading data

Once you've added data, now you can query it. OrbitDB gives you a number of ways to do this. You will learn a couple ways to do it here, and we will cover the lower-level techniques in Part 3.

Each store is going to have its own specific API, but generally `get` and `put` will be available.

Run this code to get 

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


## Updating Data


## Deleting Data


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
