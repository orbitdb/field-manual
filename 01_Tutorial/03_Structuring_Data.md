## Chapter 3 - Structuring your data

> or, "How you learned to stop worrying and love _nested databases_."

<div>
  <h3>Table of Contents</h3>

Please complete [Chapter 2 - Managing Data](./02_Managing_Data.md) first.

- [Adding a practice counter to each piece](#adding-a-practice-counter-to-each-piece)
- [Utilizing your practice counter](#utilizing-your-practice-counter)
- [Adding a higher-level user database](#adding-a-higher-level-user-database)
- [Dealing with fixture data](#dealing-with-fixture-data)
- [Key takeaways](#key-takeaways)

</div>

### Adding a practice counter to each piece

Your users may want to keep track of their practice, at minimum how many times they practiced a piece. You will enable that functionality for them by creating a new OrbitDB `counter` store for each piece, and creating a few new functions inside the `NewPiecePlease` class to interact with the counters.

> **Note:**  The nesting approach detailed here is but one of many, and you are free to organize your data as you see fit. This is a powerful feature of OrbitDB and we are excited to see how people tackle this problem in the future!

Update the `addNewPiece` function to create a `counter` store every time a new piece is added to the database. You can utilize basic access control again to ensure that only a node with your IPFS node's ID can write to it.

```diff
async addNewPiece (hash, instrument = 'Piano') {
  const existingPiece = this.pieces.get(hash)
  if(existingPiece) {
    await this.updatePieceByHash(hash, instrument)
    return;
  }

+ const dbName = 'counter.' + hash.substr(20,20)
+ const counter = await this.orbitdb.counter(dbName, this.defaultOptions)

  const cid = await this.pieces.put({ hash, instrument,
+   counter: counter.id
  })

  return cid
}
```

In your application code this would look something like this:

```JavaScript
const cid = await NPP.addNewPiece('QmdzDacgJ9EQF9Z8G3L1fzFwiEu255Nm5WiCey9ntrDPSL', 'Piano')
const content = await NPP.node.dag.get(cid)
console.log(content.value.payload.value)
```

Which will then output something like:

```json
{
  "hash":"QmdzDacgJ9EQF9Z8G3L1fzFwiEu255Nm5WiCey9ntrDPSL",
  "counter":"/orbitdb/zdpuAoM3yZEwsynUgeWPfizmWz5DEFPiQSvg5gUPu9VoGhxjS/counter.fzFwiEu255Nm5WiCey9n",
  "instrument":"Piano"
}
```

#### What just happened?

You changed your code to add a new database of type `counter` for each new entry added to the database.

- `const options = { accessController: { write: [this.orbitdb.identity.id] }}` should be recognizable from Chapter 1. This sets options for the db, namely the `accessController` to give write access only to your node's ID.
- `this.orbitdb.counter` creates a new counter type with `options` that provide a write ACL for your IPFS node
- `const dbName = "counter." + hash.substr(20,20)` prepends `counter.` to the truncated database name. See the note below.
- `this.pieces.put` is then modified to store the _address_ of this new database for later retrieval similar to the way you  stored media addresses in a previous chapter.
- `"counter":"/orbitdb/zdpuAoM3yZEwsynUgeWPfizmWz5DEFPiQSvg5gUPu9VoGhxjS/counter.fzFwiEu255Nm5WiCey9n"` in the output now reflects this change by storing the _address_ of the new DB for later retrieval and updating.

> **Note:** There is a limit of 40 characters on the names of the databases, and multihashes are over this limit at 46. We still need unique names for each of the databases created to generate unique addresses, so we trim down the hash and prepend it with `counter.` to get around this limitation.

### Utilizing the practice counter

Now, add a few functions to `NewPiecePlease` that utilize the counters when necessary

```diff
+ async getPracticeCount (piece) {
+   const counter = await this.orbitdb.counter(piece.counter)
+   await counter.load()
+   return counter.value
+ }

+ async incrementPracticeCounter (piece) {
+   const counter = await this.orbitdb.counter(piece.counter)
+   await counter.load()
+   const cid = await counter.inc()
+   return cid
+ }
```

These can be used in your application code like so:

```JavaScript
const piece = NPP.getPieceByHash('QmdzDacgJ9EQF9Z8G3L1fzFwiEu255Nm5WiCey9ntrDPSL')
const cid = await NPP.incrementPracticeCounter(piece)
const content = await NPP.node.dag.get(cid)
console.log(content.value.payload)
```

That will `console.log` out something like:

```json
{
  "op":"COUNTER",
  "key":null,
  "value": {
    "id":"042985dafe18ba45c7f1a57db.........02ae4b5e4aa3eb36bc5e67198c2d2",
    "counters": {
      "042985dafe18ba45c7f1a57db.........02ae4b5e4aa3eb36bc5e67198c2d2":3
    }
  }
}
```

#### What just happened?

You created and used two new functions to both read the value of, and increment a `counter`, another type of OrbitDB store.

- `await this.orbitdb.counter(piece.counter)` is a new way of using `this.orbitdb.counter`, by passing in an existing database address. This will _open_ the existing database instead of creating it
- `counter.load()` is called once in `getPracticeCount`, loading the latest database entries into memory for display
- `await counter.inc()` increments the counter, like calling `counter++` would on an integer variable
- `"op":"COUNTER"` is a new operation that you haven't seen yet - remember, you can create stores with any operations you want. More on this in Part 3.
- `"counters": { "042985dafe18ba45c7f1a57db.........02ae4b5e4aa3eb36bc5e67198c2d2": 3 }` is the value returned, the long value is an id based on your node's public key

### Adding a higher-level database for user data

Pieces of music to practice with are great to have, but moving forward you will want to allow users to further express themselves via a username and a profile.  You will create a new database for users, from which your database of pieces will be referenced. This will also help prepare you for allowing users to connect to each other in the next chapter.

Update your `_init` function to look like this:

```diff
  async _init() {
    this.orbitdb = await OrbitDB.createInstance(this.node)
    this.defaultOptions = { write: [this.orbitdb.identity.id] }

    const docStoreOptions = {
      ...this.defaultOptions,
      indexBy: 'hash',
    }
    this.pieces = await this.orbitdb.docstore('pieces', docStoreOptions)
    await this.pieces.load()

+   this.user = await this.orbitdb.kvstore('user', this.defaultOptions)
+   await this.user.load()
+   await this.user.set('pieces', this.pieces.id)

    this.onready()
  });
```

Then add the following functions in your class:

```diff
+ async deleteProfileField (key) {
+   const cid = await this.user.del(key)
+   return cid
+ }

+ getAllProfileFields () {
+   return this.user.all;
+ }

+ getProfileField (key) {
+   return this.user.get(key)
+ }

+ async updateProfileField (key, value) {
+   const cid = await this.user.set(key, value)
+   return cid
+ }
```

In your application code, you can use them like this:

```JavaScript
await NPP.updateProfileField("username", "aphelionz")

const profileFields = NPP.getAllProfileFields()
// { "username": "aphelionz", "pieces": "/orbitdb/zdpu...../pieces" }

await NPP.deleteProfileField("username")
```

We think you're getting the idea.

#### What just happened?

You created a database to store anything and everything that might pertain to a user, and then linked the `pieces` to that, nested inside.

- `this.orbitdb.kvstore('user', this.defaultOptions)` creates a new OrbitDB of a type that allows you to manage a simple key-value store.
- `this.user.set('pieces', this.pieces.id)` is the function that the `kvstore` uses to set items. This is equivalent to something like the shorthand `user = {}; user.pieces = id`
- `this.user.all` contains all keys and values from a `keystore` database **This is a property, not a function!**
- `this.user.del(key)` deletes the specified key and corresponding value from the store
- `this.user.get(key)` retrieves the specified key and the corresponding value from the store

### Dealing with fixture data

Fresh users to the app will need a strong onboarding experience, and you will enable that for them now by giving people some data to start with, and you will want this process to work offline.

First, create the `loadFixtureData` function inside the `NewPiecePlease` class:

```diff
+ async loadFixtureData (fixtureData) {
+   const fixtureKeys = Object.keys(fixtureData)
+   for (let i in fixtureKeys) {
+     let key = fixtureKeys[i]
+     if(!this.user.get(key)) await this.user.set(key, fixtureData[key])
+   }
+ }
```

Then, update your _init_ function to call `loadFixtureData` with some starter data:

```diff
  async _init() {
+   const peerInfo = await this.node.id()
    this.orbitdb = await OrbitDB.createInstance(this.node)
    this.defaultOptions = { accessController: { write: [this.orbitdb.identity.id] }}

    const docStoreOptions = {
      ...this.defaultOptions,
      indexBy: 'hash',
    }
    this.pieces = await this.orbitdb.docstore('pieces', docStoreOptions)
    await this.pieces.load()

    this.user = await this.orbitdb.kvstore('user', this.defaultOptions)
    await this.user.load()

+   await this.loadFixtureData({
+     'username': Math.floor(Math.random() * 1000000),
+     'pieces': this.pieces.id,
+     'nodeId': peerInfo.id
+   })

    this.onready()
  }
```

Then, if you were to clear all local data and load the app from scratch, you would see this:

```JavaScript
var profileFields = NPP.getAllProfileFields()
console.log(profileFields)
```

You would see:

```json
{
  "nodeId": "QmXG8yk8UJjMT6qtE2zSxzz3U7z5jSYRgVWLCUFqAVnByM",
  "pieces": "/orbitdb/zdpuArXLduV6myTmAGR4WKv4T7yDDV7KvwkmBaU8faCdrKvw6/pieces",
  "username": 304532
}
```

#### What just happened?

You created simple fixture data and a function to load it into a fresh instantiation of the app.

- `for (let i in fixtureKeys)` - this type of for loop is used to ensure that the writes happen serially, one after another.
- `await this.user.set(key, fixtureData[key])` sets the user profile key to the fixture value, if the key does not exist
- `await this.node.id()` is a slight misnomer, as it provides a more generalized `peerInfo` object.
- `peerInfo.id` contains the ID string you want, the base58 hash of the IPFS id.

### Key takeaways

- The distributed applications of the future will be complex and require data structures to mirror and manage that complexity.
- Luckily, OrbitDB is extremely flexible when it comes to generating complex and linked data structures
- These structures can contain any combination of OrbitDB stores - you are not limited to just one.
- You can nest a database within another, and you can create new databases to nest your existing databases within.
- _Nesting_ databases is a powerful approach, but it is one of many. **Do not** feel limited. **Do** share novel approaches with the community.
- Fixture data can be loaded easily, and locally, by simply including a basic set of values during app initialization

<strong>And with this, you are now ready to connect to the outside world. Continue to [Chapter 4: Peer-to-Peer, Part 1](04_P2P_Part_1.md) to join your app to the global IPFS network, and to other users!</strong>
