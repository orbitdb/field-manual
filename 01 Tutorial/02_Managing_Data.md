**Note:** Please complete [Chapter 1 - Laying the Foundation](./01_Basics) first. 

# Chapter 2 - Managing Data

> Managing data in OrbitDB involves _choosing the appropriate data stores_, _loading databases into memory_, _putting data_ and _getting data_.

## Choosing a Data Store

OrbitDB organizes its functionality by separating different data management concerns, schemas and APIs into **stores**. We chose a `docstore` for you in the last chapter, but after this tutorial it will be your job to determine the right store for the job.

At your disposal you have:

- **[log](https://github.com/orbitdb/orbit-db/blob/master/API.md#orbitdblognameaddress)**: an immutable (append-only) log with traversable history. Useful for *"latest N"* use cases or as a message queue.
- **[feed](https://github.com/orbitdb/orbit-db/blob/master/API.md#orbitdbfeednameaddress)**: a mutable log with traversable history. Entries can be added and removed. Useful for *"shopping cart"* type of use cases, or for example as a feed of blog posts or "tweets".
- **[keyvalue](https://github.com/orbitdb/orbit-db/blob/master/API.md#orbitdbkeyvaluenameaddress)**: a key-value database just like your favourite key-value database.
- **[docs](https://github.com/orbitdb/orbit-db/blob/master/API.md#orbitdbdocsnameaddress-options)**: a document database to which JSON documents can be stored and indexed by a specified key. Useful for building search indices or version controlling documents and data.
- **[counter](https://github.com/orbitdb/orbit-db/blob/master/API.md#orbitdbcounternameaddress)**: Useful for counting events separate from log/feed data.

## Getting Started

To start, you'll do a couple of things to enhance our current code and tidy up.

Return to your `ready` event handler from earlier:

```javascript
node.on("ready", async () => {
  orbitdb = await OrbitDB.createInstance(node)

  const options = {
    accessController: { write: [orbitdb.identity.publicKey] },
    indexBy: "hash"
  }
  
  piecesDb = await orbitdb.docstore('pieces', options)
  console.log(piecesDb.id)
})
```

Now, you'll change it to:

```javascript
node.on("ready", async () => {
  orbitdb = await OrbitDB.createInstance(node)

  const options = {
    accessController: { write: [orbitdb.identity.publicKey] },
    indexBy: "hash"
  }
  piecesDb = await orbitdb.docstore('pieces', options)
  await piecesDb.load()

  pieces = piecesDb.get('all')
  console.log(pieces)
})$                                                   
```

Now you will see an empty array `[]` for an output. While not very impressive, it's still an important milestone.

### What just happened?

* `await piecesDb.load()` is a function that will need to be called whenever we want the latest and greatest snapshot of data in the database. `load()` retrieves all of the values in the data
* `pieces = piecesDb.get('all')`

> **Note:** about memory usage

## Adding data to our database

Now that you have a database set up, adding content to it is fairly easy. Run the following code to add some sheet music to the repository.

We have uploaded and pinned a few piano scores to IPFS, and will provide the hashes here:

```javascript
const hash = await piecesDb.put({
  hash: "",
  instrument: formData.get("instrument")
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

> **Note:** "dag" is code for DAG, or Directed Acyclic Graph. More on this in Part 4

## Reading data

## Storing Media Files

We are often asked if it is possible to store media files like pictures or audio directly inside OrbitDB. Our answer is that you should treat this like any other database system and store the _address_ of the 

Luckily, with content addressing in IPFS, this becomes rather easy, and predictable from a schema design standpoint. The overall pattern in:

1. Add the file to IPFS, which will return the _multihash_ of the file
2. Store said multihash in OrbitDB 
3. When it comes time to display the media, use native IPFS functionality to retrieve it from the hash

## Schema design, or "How I learned to stop worrying and love nested databases"

### Adding a practice counter to each piece 

### Wrapping it all inside of a user database

### What just happened?

You just nested multiple databases inside of your pieces database, and then nested ALL of that inside a user database, connected by their addresses.

* Resolves #[365](https://github.com/orbitdb/orbit-db/issues/365) 
* Resolves #[438](https://github.com/orbitdb/orbit-db/issues/438)
* Resolves #[381](https://github.com/orbitdb/orbit-db/issues/381)
* Resolves #[242](https://github.com/orbitdb/orbit-db/issues/242)
* Resolves #[430](https://github.com/orbitdb/orbit-db/issues/430)


## Key Takeaways

* Always `load()` your data before querying your database. You will be sad otherwise
* While you technically _can_ store encoded media directly in a database, media files are best stored in OrbitDB
* 
