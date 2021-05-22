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
which is a reference to
one of the two kinds of
Conflict Free Replicated Data Types (CRDTs),
that can be implemented using OrbitDB, [Operation-based CRDTs](https://en.wikipedia.org/wiki/Conflict-free_replicated_data_type#Operation-based_CRDTs).
But [State-based CRDTs](https://en.wikipedia.org/wiki/Conflict-free_replicated_data_type#State-based_CRDTs) can be implemented on OrbitDB as well.

Each operation should have three fields:
- `op` is a string to identify the type of operation. In this case it is `"PUTNOTES"`.
- `key` an optional key field to identify the `data` field.
- `value` is the actual data of the operation and the Store can put data of any JSON serializable format here.
In `putNotes` this stores the CID and MIME Type of the Notes data.

### More interface functions
Besides adding new Notes, we also have to be able to delete them
and fetch them.
Let's implement a `deleteNotes` and `getNotes` methods to do this:

```js
async deleteNotes(hash, options = {}) {
  const operation = {
    op: "DELNOTES",
    key: null,
    value: hash
  }
  return this._addOperation(operation, options)
}

getNotes(hash) {
  const entry = this.get(hash).payload
  return entry
}
```

#### What happens here?
As you can see, `deleteNotes` also creates
an operation.
It is not very different to `putNotes`,
except that the `value` and `op` fields
have different values and formats.
The actual deleting happens in the Index
upon parsing the operation.

*Deleting decentralized data, that has been added
to IPFS, is never certain and if you add Personally identifiable information
to OrbitDB or other data, where it has to be possible to delete them,
you'll never be sure, that they have been deleted across  the entire network.
So, don't do that.*

`getNotes` is using the `this.get` method, inherited from
the `EventStore`.
It might be important to explain, that `EventStore.get().payload`
is equivalent to, what has been passed to `_addOperation` as the
operation object.
So, the object returned by `getNotes` should look like this for example:
```js
{
  op: "PUTNOTES",
  key: null,
  value: {
    cid: "Qm...",
    mime: "application/pdf"
  }
}
```

### Key takeaways.
- Custom Stores function as interfaces between the `ipfs-log`, Index and the users.
- The Store can add entries to the `ipfs-log`
- The Store can read from the Index (as we did in `getNotes`).
- The `ipfs-log` of a database is sometimes called `oplog`, because the entries
are called Operations.

**[Next: Implementing a comment system]**
