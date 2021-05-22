# Defining the Store Interface with your Application
In the last chapter, we have seen, that OrbitDB
Stores are defined as classes and inherit
from another store.

You can choose one of these Stores to inherit from for
your own custom Store, but we'll use the `EventStore`:

1. `Store`
2. `EventStore`
3. `FeedStore`
4. `DocumenStore`
5. `CounterStore`

If you use them, you'll also be inheriting their
interfaces.
So, because we extend the `EventStore`, the
store will have the same `get`, `put` and `iterator`
functions and they will work exactly the same,
until we override them.

## The Store stands between the `ipfs-log`, the Index and the user.
For our purposes the stores can be understood as the Interface
between the `ipfs-log`, the index and the users:

- The `ipfs-log` is a DAG, that is stored on IPFS
- The Index is a data structure created from parsing the `ipfs-log` in local storage.
- The Users are the developers, who want to use the database through the `Store` class.

The Store handles the `ipfs-log` and the Index
under the hood, while providing an
easy to use API for the Users, who don't have
to concern  themselves with the `ipfs-log` and
Index.

## Defining the Interface
In the first tutorial, we had
defined several interface
functions,
such as `addNewPiece` or `updatePieceByHash` and so forth.

But before we can do this, we have to implement the
constructor of the `NotesStore` class.

```js
constructor(ipfs, id, dbname, options) {
  super(ipfs, id, dbname, options)
  this._type = NoteStore.type
  this._ipfs = ipfs
}

static get type () { return "notesStore" }
```

#### What happened here?
The constructor gets 4 arguments:
1. `ipfs` is the `js-ipfs` instance. We store it for later.
2. `id` is TODO
3. `dbname` is the name of the `Store` and the last part of the orbit-db addresses.
4. `options` is an object containing several options (TODO options)

After that we set the `_type` property after
the static `type` value.
You have to set a unique value for each store type here.

### A `putNotes` function

Let's implement a `putNotes` method for `NotesStore` now.
Add this method to the `NotesStore` class.

```js
async putNotes(data, mime, options = {}) {
  const {cid} = await ipfs.add(data)

  if(options.pin) await ipfs.pin.add(cid)

  return await this._addOperation({
    op: "PUTNOTES",
    key: null,
    data: {
      cid: cid.toString(),
      mime: mime
    }
  }, options)
}
```

#### What happend here?
We defined a method, that
takes a data argument, which
is a notes file as binary `Uint8Array`,
that'll have been received through the UI.

But instead of storing it in the
database, the `putNotes` function
adds the data to IPFS and
then stores the CID and the
mime type in the database.

Let's see, how this is done:
The `_addOperation` function
is called and provided with an object.
This object is serialized
stored in the `ipfs-log`
and once parsed, this
should have an effect
on the `Index`.

This is why, the `ipfs-log` is
sometimes called an `oplog` or
operations log.
Because it is a log of operations,
which is a reference
