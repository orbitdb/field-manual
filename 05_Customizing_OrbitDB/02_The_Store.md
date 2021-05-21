# Custom Stores for a comment system
When we last left off on this source code,
we had developed a Note Sharing App.

We used a `DocumenStore` to store the Notes Files CID
and meta data and a `KeyValueStore` to store a User Profile.

Now, this system is not bad.
And we could extend this system with further
built-in databases for ever more complex combinations
of databases.

Maybe adding a comment system first.
And for each thread of discussion,
we create a new database.

So, why should you define your own custom stores?

#### Advantages of Custom Stores
- You can create your own interface functions. (Instead of the standard `get`, `put` and `iterator`)
- You can implement your own data structure to use in local storage and optimize these for your use case.
- You can implement encryption and decryption more easily.

And why shouldn't you?
### Disadvantages
- You will have to learn about a lot of OrbitDB internals. (This can be seen as an advantage by some)
- You will have to test your own data types and ensure, they actually are a CRDTs.

It is your decision and should depend on your
use case, to use a custom store or built-in store.

# Implementing the NotesStore
We will now implement the `NotesStore` class,
which inherits from the `DocumentStore`,
which will make it possible to

- Store & upload pieces of notes
- Comment on pieces of notes

### The first tutorial
We will base the source code
of this tutorial on the first
tutorial in this book.

So, if you have worked through said
tutorial, you can use the code you wrote there.
(Unless you made some significant changes yourself)

Or you can download the version of the source code, that
we'll be using here from [GitHub](../code_examples/05_Customizing_OrbitDB/02).

### Isomorphic bookends
You should be able to
work in the browser and
on NodeJS.

To do this, we will be setting up
some isomorphic bookends
to make our code compatible and not
mention it afterwards.

Add this to the `NotesStore.js`

```js
function notesStore(IPFS, OrbitDB) {
  class NotesStore extends OrbitDB.DocumentStore {
  }

  return NotesStore
}

try {
  const IPFS = require("ipfs")
  const OrbitDB = require("orbit-db")

  module.exports = notesStore(IPFS, OrbitDB)
} catch (e) {
  window.NotesStore = notesStore(window.Ipfs, window.OrbitDB)
}
```

### Key take aways.
- OrbitDB stores can be greatly modified and adapted to your use case.
- Custom Stores have advantages, but are not for everybody and every use case.
- OrbitDB Stores are implemented as classes and inherit from other Stores.

**Next: [Defining the Store Interface with your Application](03_The_Store_as_an_Interface.md)**
