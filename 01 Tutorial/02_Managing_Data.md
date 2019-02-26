**Note:** Please complete Chapter 1 before reading. 

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

* `await piecesDb.load()`
* `pieces = piecesDb.get('all')`

## Adding data to our database

Now that you have a database set up, adding content to it is fairly easy. Run the following code to add some sheet music to the repository.

```javascript
const hash = await piecesDb.put({
  _id: Date.now(),
  url: ,
  instrument: formData.get("instrument")
})
                                                
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
    "_id":1551137682387,
    "url":"12345",
    "instrument":"Accordion"
  }
}
```

### What just happened?

* `piecesDb.put({ ... })` is the primary. This call returns a _mutlihash_, which is the hash of the content added to IPFS. 
* `node.dag.get` is a function that takes a Content ID (CID) and returns content. 

> **Note:** "dag" is code for DAG, or Directed Acyclic Graph. More on this in Part 4

## Storing Media Files

## Reading data

## Schema design, or "How I learned to stop worrying and love nested databases"

* Resolves #[365](https://github.com/orbitdb/orbit-db/issues/365) 
* Resolves #[438](https://github.com/orbitdb/orbit-db/issues/438)
* Resolves #[381](https://github.com/orbitdb/orbit-db/issues/381)
* Resolves #[242](https://github.com/orbitdb/orbit-db/issues/242)
* Resolves #[430](https://github.com/orbitdb/orbit-db/issues/430)
