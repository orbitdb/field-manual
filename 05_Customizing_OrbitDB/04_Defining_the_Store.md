# Defining the Store
We now have our own
`Index` in `NotesIndex.js`.

But how can we use it?
Through the Store.

The Store, as we know,
actually does not store
the state of the Database,
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

# The `NotesStore` class
You should now add a new JavaScript file
and call it `NotesStore.js`.

## Isomorphic Bookends
For the third time in this Manual:
Let's define an isomorphic bookend:
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

## Defining the `NotesStore` class
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
the options already has an `Index` specified.

Besides this, all stores have to have a `type` property,
to uniquely identify the `NotesStore`.

## Defining a `getNotes` and `getComments`
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
if no other Index was passed in to the constructor
and we can easily access the methods we defined on the Index.
