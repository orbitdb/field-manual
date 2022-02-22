## Defining the Store

We now have our own
`Index` in `NotesIndex.js`.

But how can we use it?
Through the `Store`.

The Store, as we know,
actually does not store
the state of the Database
because this is the
job of the `Index`.

The function of the job is
to provide an easy
to use, intuitive API
for the end-user,
such that they do not
have to bother about
things, like CRDTs,
`ipfs-log` or the `DAG`.

You already know a lot
of stores, at least
if you read the first
Tutorial in this Manual.

Because there are five built-in
stores, which will I not bother recounting here.

### The `NotesStore` class

You should now add a new JavaScript file
and call it `NotesStore.js`.

#### Isomorphic Bookends

For the third time in this Manual,
let's define an isomorphic bookend:

```js
function notesStore(IPFS, OrbitDB, NotesIndex) {

}

try {
  const IPFS = require("ipfs")
  const OrbitDB = require("orbit-db")
  const NotesIndex = require("./NotesIndex")

  module.exports = notesStore(IPFS, OrbitDB)
} catch (e) {
  console.log(e)
  window.NoteStore = notesStore(window.Ipfs, window.OrbitDB, window.NotesIndex)
}
```

We'll from now on be working inside the `notesStore` function.

### Defining the `NotesStore` class

To define a Store, we have to extend
an existing Store class.
For this Tutorial, we shall use the `EventStore` class.

Add the following as the body of the `notesStore` function:

```js
class NoteStore extends OrbitDB.EventStore {
  constructor(ipfs, id, dbname, options) {
    if(!options.Index) Object.assign(options, { Index: NotesIndex })

    super(ipfs, id, dbname, options)
    this._type = NoteStore.type
    this._ipfs = ipfs
  }

  static get type () {
    return "noteStore"
  }
}

return NoteStore
```

#### What is happening here?

The Store receives four parameters in it's `constructor`:

- `ipfs` - the IPFS instance passed to OrbitDB.createInstance
- `id` - the id of this database
- `dbname` - the name of the database and last part of the orbitdb addresses.
- `options` - Object of options. Most important for our purposes is the `Index` option.
It is the `Index` class, used by the database.

In the first line of the `constructor`
the `Index` option is set to `NotesIndex`, unless
the options already have an `Index` specified.

Besides this, all stores have to have a `type` property,
to uniquely identify the `NotesStore`.

### Defining a `getNotes` and `getComments`

We should probably implement a few get
functions. But this is really low effort,
since we already implemented a `getNotes` and `getComments`
function on the Index and thus we can implement
the `NotesStore.getNotes` and `NotesStore.getComments`:

```js
getNotes(cid) {
  return this._index.getNotes(cid)
}

getComments(cid, flat = true) {
  return this._index.getComments(cid, flat = flat)
}
```

As you can see, `this._index` is an instance of the `NotesIndex`,
if no other Index was passed in to the constructor,
and we can easily access the methods we defined in the Index.

### Adding Data to the Store

Now, let's finally add some data
to our Store.

First, we should make it possible
to add a Notes Piece by it's CID:

```js
addNotesByCID(cid, mime, instrument = "piano", options = {}) {
  return this._addOperation({
    op: "ADDNOTES",
    key: null,
    value: {
      cid: cid,
      mime: mime,
      instrument: instrument
    }
  }, options)
}
```

*The `NotesStore.addNotesByCID` method*

As you can see, we use an `_addOperation`
method, which adds an operation
to the `ipfs-log` or `oplog`, which
meets us again in the `updateIndex` method.

`_addOperation` returns a `Promise<CID>`,
so a promise of the hash of the operation
entry in the oplog.

And we also define a format for the notes:

```js
value: {
  cid: cid,
  mime: mime,
  instrument: instrument
}
```

### `addNotesBinary`

But we can still do more for the user
in this store.
`addNotesByCID` adds a notes file by it's CID.
But this expects the notes file to have been
added to IPFS, something that we can
do automatically since we stored the
IPFS Node in the `this._ipfs` variable.

```js
async addNotesBinary(binary, mime, instrument = "piano", options = {}) {
  let {cid} = await this._ipfs.add(binary)

  if(options.pin) await this._ipfs.pin.add(cid)

  return await this.addNotesByCID(cid.toString(), mime, instrument = instrument, options = options)
}
```

This method adds the `Uint8Array` `binary` to IPFS.
It then pins the data to the local IPFS Node,
if the `options.pin` boolean is `true`.

Afterwards, it calls the `addNotesByCID` function,
with the generated `cid`.

This is just an example of how you
can make the Store API encompass more,
than just adding operations to the `oplog`.

For some other ideas of what can be done in the store,
prior to adding an operation:

- Formatting (with Protobuf)
- Encryption and Decryption

#### Adding Comments

After a user added their
musical notes to their Database,
users might want to add comments
to the notes.

Let's add an `addComment` method.

```js
addComment(text, reference) {
  if(this._index.getNotes(reference) !== undefined || this._index._comments[reference] !== undefined) {
     return this._addOperation({
       op: "ADDCOMMENT",
       key: reference,
       value: text
     })
  } else {
    return null
  }
}
```

You might observe, that this function performs
some validation prior to creating the operation,
ensuring that the reference actually exists.
This is one way how you can use the store, too,
but you might want to do this in the index instead.

By the way, all operations are signed by
your OrbitDB Identity on creation and
we thus don't need to add any further
information about the author.
See the [Implementing `ADDCOMMENT` handling](03_Defining_the_Index.md#Implementing-ADDCOMMENT-handling)
section of the previous chapter.

## Other Stores

You might note that this is a very complicated
custom store and index.
But the actual techniques used
are deployed already in all of the
built-in Stores.

So, if you want further examples of how
you could implement your own custom
stores, reading the source code of the
`*Store.js` and `*Index.js` file
can be very illuminating and inspiring.

I would advice reading the [`EventIndex.js`](https://github.com/orbitdb/orbit-db-eventstore/blob/main/src/EventIndex.js)
and the [KVStore's Store and Index files](https://github.com/orbitdb/orbit-db-kvstore/blob/main/src/).

## Key Takeaways

- Stores inherit from each other. So you can extend built-in stores.
- Stores work with the `Index` and the `this._addOperation` mostly.
- `this._addOperation` adds an operation to the oplog and you can specify the `payload` field of each operation here.
- Stores can also do more, than just reading and writing from the database, like:
  1. You can use them to implement custom encryption/decryption
  2. Format your data in specific ways (protobuf?)

**Next: [Conclusion](05_Conclusion.md)**
