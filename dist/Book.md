

# The OrbitDB Field Manual

Readme TBD
_Note:_ Please see the [README](./README.md) before beginning this chapter.

# Tutorial Chapter 1 - Laying the Foundation

> The basics of OrbitDB include undertanding how to _install OrbitDB (and IPFS)_, _create a new databases_, and how _addressing_ works. 

## Instantiating OrbitDB

Start by installing OrbitDB and its dependency, IPFS. The process is different between the browser and node.js, so we cover 
both here.

### Installation in Node.js

Choose a project directory and `cd` to there from your command line:

From the command line:
```bash
$ npm install orbitdb ipfs
```

Then, in your script, require the modules:

```javascript
const Ipfs = require('ipfs')
const OrbitDB = require('orbit-db')
```

### Installation in the Browser

For the purposes of this tutorial, we recommend using unpkg for obtaining pre-built, minified versions of both IPFS and 
OrbitDB. Simply include these at the top of your `index.html` file:

```html
<script src="https://unpkg.com/ipfs/dist/index.min.js"></script>
<script src="https://www.unpkg.com/orbit-db/src/OrbitDB.js"></script>
```

There are other ways to get this code, including building it yourself. We detail these in Part 3. 

## Standing up IPFS and OrbitDB

We have designed Chapters 1 and 2 of the tutorial to work work offline, not requiring any internet connectivity or 
connections to peers. 

OrbitDB requires a running IPFS node to operate, so you will create one here and notify OrbitDB about it. by running the 
following code.

```javascript
let orbitdb

let node = new Ipfs({
  preload: { enabled: false },
  repo: "./ipfs",
  EXPERIMENTAL: { pubsub: true },
  config: {
    Bootstrap: [],
    Addresses: { Swarm: [] }
  }
});

node.on("error", (e) => { throw new Error(e) })
node.on("ready", async () => {
  orbitdb = await OrbitDB.createInstance(node)
  console.log(orbitdb.id)
})
```

In the output you will see something called a "multihash", like `QmPSicLtjhsVifwJftnxncFs4EwYTBEjKUzWweh1nAA87B`. For now, 
just know that this is the identifier of your IPFS node. We explain multihashes in more detail in **Part 2: Peer-to-Peer**

### What just happened?

Starting with the `new Ipfs` line, your code creates a new IPFS node. Note the default settings:

* `preload: { enabled: false }` disables the use of so-called "pre-load" IPFS nodes. These nodes exist to help load balance 
the global network and prevent DDoS. However, these nodes can go down and cause errors. Since we are only working offline 
for now, we include this line to disable them.
* `repo: './ipfs'` designates the path of the repo in node.js only. In the browser, you can actually remove this line. The 
default setting is a folder called `.jsipfs` in your home directory. You will see why we choose this acute location for the 
folder later.
* `XPERIMENTAL: { pubsub: true }` enables IPFS pubsub, which is a method of communicating between nodes and is required for OrbitDB usage, despite whether or not we are connected to other peers.
* `config: { Bootstrap: [], Addresses: { Swarm: [] }}` sets both our bootstrap peers list (peers that are loaded on 
instantiation) and swarm peers list (peers that can connect and disconnect at any time to empty. We will populate these 
later.
* `node.on("error", (e) => { throw new Error(e) })` implements extremely basic error handling for if something happens 
during node creation
* `node.on("ready", (e) => { orbitdb = new OrbitDB(node) })` instantiates OrbitDB on top of the IPFS node, when it is ready.

By running the code above, you have created a new IPFS node that works locally and is not connected to any peers.
You have also loaded a new `orbitdb` object into memory, ready to create databases and manage data.

*You are now ready to use OrbitDB!*

* Resolves #[367](https://github.com/orbitdb/orbit-db/issues/367)

#### What else happened in node.js?

When you ran the code in node.js, you created two folders in your project structure: `'orbitdb/` and `ipfs/`. 

```bash
$ # slashes added to ls output for effect
$ ls orbitdb/
QmNrPunxswb2Chmv295GeCvK9FDusWaTr1ZrYhvWV9AtGM/

$ ls ipfs/
blocks/  config  datastore/  datastore_spec  keys/  version
```

Focusing your attention on the IPFS folder, you will see that the subfolder has the same ID as orbitdb. This is purposeful, 
as this initial folder contains metadata that OrbitDB will need to operate. For now let's not go into detail

The `ipfs/` folder contains all of your IPFS data. Explaining this in depth is outside of the scope of this tutorial, and 
the curious can find out more [here](#). 

#### What else happened in the browser?

In the browser IPFS content is handled inside of IndexedDB, a persistent storage mechanism for browsers

![alt browser whatever](../images/ipfs_browser.png)

Note since you have not explicitly defined a database in the broser, no IndexedDB databases have been created for OrbitDB yet.

**Caution!** iOS and Android have been known to purge IndexedDB if storage space needs to be created inside of your phone. 
We recommend creating robust backup mechanisms at the application layer.

## Creating a Database

Now you will create a local database that *only you8 can read.

Remember the code snippet from above, starting and ending with:

```javascript
let orbitdb

/* ... */

node.on("ready", async () => {
  orbitdb = new OrbitDB.createInstance(node)
  console.log(orbitdb.id)
})
```

Expand that to the following, and then run the code:

```javascript
let orbitdb, pieces

/* ... */

node.on("ready", async () => {
  orbitdb = await OrbitDB.createInstance(node)

  const options = {
    accessController: { write: [orbitdb.identity.publicKey] }
    indexBy: "hash"
  }
  
  pieces = await orbitdb.docstore('pieces', options)
  await pieces.load()
  
  pieces = piecesDb.get('all')
  console.log(pieces.address)
})
```

You will see the output of a simple empty array, `[]`. We understand this may not be immediately impressive, but a lot of important things quietly happened.

### What just happened?

Your code created a new database, of type "docstore", writable only by you.

* The `options` defines the paramaters for the database we are about to create.
  * `accessController: { write: [orbitdb.identity.publicKey] }` defines the ACL, or "Access Control List". In this instance 
  we are restricting `write` access to ONLY orbitdb instances identified by our particular `publicKey` 
  * `indexBy: "hash"` is a docstore-specific option, which specifies which field to index our database by
* `pieces = await orbitdb.docstore('pieces', options)` is the magic line that creates the database. Once this line is 
completed, the database is open and can be acted upon.

**Caution!** A note about identity: Your public key is not your identity. We repeat, *your public key is not your identity*. 
Though, it is often used as such for convenience's sake, and the lack of better alternatives. So, in the early parts of this 
tutorial we say "writable only to you" when we really mean "writable only by an OrbitDB instance on top of an IPFS node that 
has the correct id, which we are assuming is controlled by you."

See for more info: https://github.com/orbitdb/orbit-db/blob/525978e0a916a8b027e9ea73d8736acb2f0bc6b4/src/OrbitDB.js#L106

* Resolves #[366](https://github.com/orbitdb/orbit-db/issues/366)
* Resolves #[502](https://github.com/orbitdb/orbit-db/issues/502)

#### What else happened in node.js?


#### What else happened in the browser?

## Addressing

This section isn't necessarily a hands-on part of the tutorial, but it's incredibly important 

##  Reading and Writing Data

> Potentially split out to chapter 2?

* Resolves #[365](https://github.com/orbitdb/orbit-db/issues/365) 
* Resolves #[438](https://github.com/orbitdb/orbit-db/issues/438)
* Resolves #[381](https://github.com/orbitdb/orbit-db/issues/381)
* Resolves #[242](https://github.com/orbitdb/orbit-db/issues/242)
* Resolves #[430](https://github.com/orbitdb/orbit-db/issues/430)
## Chapter 2: Peer-to-Peer

### Replication Overview

* Resolves #[463](https://github.com/orbitdb/orbit-db/issues/463)
* Resolves #[468](https://github.com/orbitdb/orbit-db/issues/468)
* Resolves #[471](https://github.com/orbitdb/orbit-db/issues/471)
* Resolves #[498](https://github.com/orbitdb/orbit-db/issues/498)
* Resolves #[519](https://github.com/orbitdb/orbit-db/issues/519)
* Resolves #[296](https://github.com/orbitdb/orbit-db/issues/296)
* Resolves #[264](https://github.com/orbitdb/orbit-db/issues/264)
* Resolves #[460](https://github.com/orbitdb/orbit-db/issues/460)
* Resolves #[484](https://github.com/orbitdb/orbit-db/issues/484)
* Resolves #[474](https://github.com/orbitdb/orbit-db/issues/474)
* Resolves #[505](https://github.com/orbitdb/orbit-db/issues/505)

### Replicating in the Browser
### Replicating in Node.js
### Replication between Browser and Node.js

* Resolves #[496](https://github.com/orbitdb/orbit-db/issues/496)
# The OrbitDB Tutorial

> An interactive, imperative adventure of peer-to-peer, decentralized, and distributed proportions

## Requirements

* A computer
* A command line (unix/linux based or windows command prompt)
* A modern web browser (Firefox, Chrome, Edge, etc)
* Node.js installed

## What will I build?

You will build an app that provides royalty-free sheet music on-demand for musicians, based on their instrument. 

You will access a global catalog of royalty-free sheet music. Then, given an instrument name as input (Violin, Saxophone, Marimba) you it will display piece of sheet music at random. Futhermore, you will give the users the ability to submit their own music and share it with connected peers.

You will use OrbitDB as the backbone for this, creating a few databases:
1. The "global" starter database of royalty free pieces for all to use (read only)
2. The user database of pieces they can upload - private

You will write JavaScript and create the backbone of a full application using OrbitDB in both the
browser and on the command line. For the sake of keeping things focused, we will exclude any
HTML or CSS from this tutorial and focus only on the Javascript code.

### Why a music app?

OrbitDB is already used all over the world, and this tutorial music reflect that. There are other many topics we could
have chosen that touch the vast majority of humans on earth: finance, politics, climate, religion. However, those are
generally contentious and complicated.

We believe that **music** is a uniquely universal cultural feature - something that we more humans than any other topic
share, enjoy, or at least appreciate. Your participation in this tutorial will make it easier for musicians all over the
world to find sheet music to practice with.

## Conventions

* Read this tutorial in order, the learning builds on itself other over time.
* You will switch between writing and reading code, and *What Just Happened* sections that explain in depth what happens on a technical level when the code is run.
* OrbitDB works in both node.js and in the browser, and this tutorial will not focus on one or the other. Stay on your toes.
* This tutorial is not only OS-agnostic and editor-agnostic, it's also folder structure agnostic. All of the code examples are designed to work if applied in order, regardless of which js file they are in. Thus folder and file names for code are avoided.
* `async` and `await` are used prominently. Feel free to replace those with explicit `Promise` objects if you're feeling daring.

Ready? Let's start with [Chapter 1: The Basics](./01_Basics.md)



# The OrbitDB Field Manual

> Short Description

## Table of Contents

- Part 1: Introduction
- Part 2: Tutorial
- Part 3: Thinking Peer to Peer
- Part 4: What comes next?

## Maintainers

TBD

## Contributing

## License

*Note:* Please see the [README](./README.md) before beginning this chapter.

# Chapter 1 - Laying the Foundation

> The basics of OrbitDB include  _installing OrbitDB (and IPFS)_, _setting up a new isomorphic project_, _creating databases_, and how _understanding how to choose data stores_. 

- [Installing the requirements: IPFS and OrbitDB](#installing-the-requirements-ipfs-and-orbitdb)
- [Instantiating IPFS and OrbitDB](#instantiating-ipfs-and-orbitdb)
- [Creating a Database](#creating-a-database)
- [Choosing a data store](#choosing-a-data-store)
- [Key Takeaways](#key-takeaways)

## Installing the requirements: IPFS and OrbitDB

You will need to get the code for OrbitDB and its dependency, IPFS, and make it available to your project. The process is 
different between the browser and node.js, so we cover both here.

### In node.js

Choose a project directory and `cd` to there from your command line. Then run the following command.

```bash
$ npm init
... enter commands to create package.json ...

$ npm install orbitdb ipfs
```

This will create a `package.json`, `package.lock`, and `node_modules` folder.

### In the Browser

For this tutorial, we recommend using unpkg for obtaining pre-built, minified versions of both IPFS and OrbitDB. Simply include these at the top of your `index.html` file:

```html
<script src="https://unpkg.com/ipfs/dist/index.min.js"></script>
<script src="https://www.unpkg.com/orbit-db/src/OrbitDB.js"></script>
```

You will now have global `Ipfs` and `OrbitDB` objects available to you. You will see how we'll use these later.

> **Note:** Both OrbitDB and js-ipfs are open source, which give you the ability to build and even contribute to the code. This will be covered in detail these in Part 3. 

## Creating the isomorphic frame for our app

Since OrbitDB works in the browser and node.js, we're going to want to make our app as _isomorphic_ as possoble. This means we want the same code to run in the browser as runs in JS. This is good news for the tutorial, as it means we can keep our code to **strictly** things that pertain to our app, and then apply bindings in node.js and 

Luckily, you will have the luxury of using the same language, JavaScript, for both node.js and browser environments. Create a new file called `newpieceplease.js` and put this code in there:

```javascript
try {
  const Ipfs = require('ipfs')
  const OrbitDB = require('orbit-db')
} catch(e) {}

class NewPiecePlease() {
  constructor(IPFS, OrbitDB) { }
}

try {
  module.exports = exports = new NewPiecePlease(IPFS, OrbitDB)
} catch (e) {
  window.NPP = new NewPiecePlease(window.Ipfs, window.OrbitDB)
}
```

### What just happened?

Using some key JavaScript features, you have created the shell for our application that runs in both node.js and the browser. It defines a new class called `NewPiecePlease`, with a constructor that takes two arguments

1. `IPFS` for the `js-ipfs` constructor
2. `OrbitDB` for the `orbit-db` constructor

In the browser, you can include this file in a script tag and have an `NPP` object at your disposal. In node.js, you can simply call something like:

```javascript
const NPP = require('./newpieceplease')
```

From here on out, we will ignore these isometric bookends and concentrate wholly on the `NewPiecePlease` class.

## Instantiating IPFS and OrbitDB

We have designed Chapters 1 and 2 of the tutorial to work work offline, not requiring any internet connectivity or 
connections to peers. 

OrbitDB requires a running IPFS node to operate, so you will create one here and notify OrbitDB about it. by running the 
following code. It's a lot but it constitutes the frame for an _isomorphic_ JavaScript app, that is, one that runs in both the browser and in node.js with the same code.



```javascript
class NewPiecePlease() {
  constructor(IPFS, OrbitDB) {
    let node = new IPFS({
      preload: { enabled: false },
      repo: "./ipfs",
      EXPERIMENTAL: { pubsub: true },
      config: {
        Bootstrap: [],
        Addresses: { Swarm: [] }
      }
    });

    node.on("error", (e) => { throw new Error(e) })
    node.on("ready", async () => {
      orbitdb = await OrbitDB.createInstance(node)
      console.log(orbitdb.id)
    })
  }
}
```

In the output you will see something called a "multihash", like `QmPSicLtjhsVifwJftnxncFs4EwYTBEjKUzWweh1nAA87B`. For now, 
just know that this is the identifier of your IPFS node. We explain multihashes in more detail in **Part 2: Peer-to-Peer**

### What just happened?

Start with the `new Ipfs` line. This code creates a new IPFS node. Note the default settings:

* `preload: { enabled: false }` disables the use of so-called "pre-load" IPFS nodes. These nodes exist to help load balance 
the global network and prevent DDoS. However, these nodes can go down and cause errors. Since we are only working offline 
for now, we include this line to disable them.
* `repo: './ipfs'` designates the path of the repo in node.js only. In the browser, you can actually remove this line. The 
default setting is a folder called `.jsipfs` in your home directory. You will see why we choose this acute location for the 
folder later.
* `XPERIMENTAL: { pubsub: true }` enables IPFS pubsub, which is a method of communicating between nodes and is required for OrbitDB usage, despite whether or not we are connected to other peers.
* `config: { Bootstrap: [], Addresses: { Swarm: [] }}` sets both our bootstrap peers list (peers that are loaded on 
instantiation) and swarm peers list (peers that can connect and disconnect at any time to empty. We will populate these 
later.
* `node.on("error", (e) => { throw new Error(e) })` implements extremely basic error handling for if something happens 
during node creation
* `node.on("ready", (e) => { orbitdb = new OrbitDB(node) })` instantiates OrbitDB on top of the IPFS node, when it is ready.

By running the code above, you have created a new IPFS node that works locally and is not connected to any peers.
You have also loaded a new `orbitdb` object into memory, ready to create databases and manage data.

*You are now ready to use OrbitDB!*

#### What else happened in node.js?

When you ran the code in node.js, you created two folders in your project structure: `'orbitdb/` and `ipfs/`. 

```bash
$ # slashes added to ls output for effect
$ ls orbitdb/
QmNrPunxswb2Chmv295GeCvK9FDusWaTr1ZrYhvWV9AtGM/

$ ls ipfs/
blocks/  config  datastore/  datastore_spec  keys/  version
```

The code will always create the `orbitdb/` folder as a sibling to the location specified in the `repo` paramater of the IPFS constructor options. Looking inside of the `orbitdb/` folder, you will see that the subfolder has the same ID as orbitdb, as well as the IPFS node. This is purposeful, as this initial folder contains metadata that OrbitDB will need to operate. See Part 3 for detailed information about this.

> *Note:* The `ipfs/` folder contains all of your IPFS data. Explaining this in depth is outside of the scope of this tutorial, and  the curious can find out more [here](#). 

#### What else happened in the browser?

In the browser IPFS content is handled inside of IndexedDB, a persistent storage mechanism for browsers

![An image showing the IPFS IndexedDB databases in Firefox](../images/ipfs_browser.png)

Note since you have not explicitly defined a database in the broser, no IndexedDB databases have been created for OrbitDB yet.

> **Caution!** iOS and Android have been known to purge IndexedDB if storage space needs to be created inside of your phone. 
We recommend creating robust backup mechanisms at the application layer.

## Creating a Database

Now, you will create a local database that *only you* can read.

Inside of the `NewPiecePlease` constructor, Expand the IPFS `ready` event handler to the following, and then run the code:

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

You will see something like the following as an output: `/orbitdb/zdpuB3VvBJHqYCocN4utQrpBseHou88mq2DLh7bUkWviBQSE3/pieces`. This is the id, or **address** (technically a multiaddress) of this database. It's important for you to not only _know_ this, but also to understand what it is.

The first bit, `/orbitdb`, is the protocol. It tells you that this address is an OrbitDB address. The last bit, `pieces` is simply the name you provided.

It's the second, or middle, part `zdpuB3VvBJHqYCocN4utQrpBseHou88mq2DLh7bUkWviBQSE3` that is the most interesting. This value comes from the combining three pieces of data, and then hashing them:
1. The **access control list** of the database
2. The **type** of the database
3. The **name** of the database

> *Note:* Misunderstanding OrbitDB addressing can lead to some very unexpected - sometimes hilarious, sometimes disastrous outcomes. Read more in Part 2 to learn more.

### What just happened?

Your code created a local OrbitDB database, of type "docstore", writable only by you.

* The `options` defines the paramaters for the database we are about to create.
  * `accessController: { write: [orbitdb.identity.publicKey] }` defines the ACL, or "Access Control List". In this instance 
  we are restricting `write` access to ONLY orbitdb instances identified by our particular `publicKey` 
  * `indexBy: "hash"` is a docstore-specific option, which specifies which field to index our database by
* `pieces = await orbitdb.docstore('pieces', options)` is the magic line that creates the database. Once this line is 
completed, the database is open and can be acted upon.

> **Caution!** A note about identity: Your public key is not your identity. We repeat, *your public key is not your identity*.  Though, it is often used as such for convenience's sake, and the lack of better alternatives. So, in the early parts of this  tutorial we say "writable only to you" when we really mean "writable only by an OrbitDB instance on top of an IPFS node that has the correct id, which we are assuming is controlled by you."

See for more info: https://github.com/orbitdb/orbit-db/blob/525978e0a916a8b027e9ea73d8736acb2f0bc6b4/src/OrbitDB.js#L106

#### What else happened in node.js?

You will see some activity inside your project's `orbitdb/` folder. This is good.

```bash
$ ls orbitdb/
QmNrPunxswb2Chmv295GeCvK9FDusWaTr1ZrYhvWV9AtGM/  zdpuB3VvBJHqYCocN4utQrpBseHou88mq2DLh7bUkWviBQSE3/

$ ls orbitdb/zdpuB3VvBJHqYCocN4utQrpBseHou88mq2DLh7bUkWviBQSE3/
pieces/

$ ls orbitdb/zdpuB3VvBJHqYCocN4utQrpBseHou88mq2DLh7bUkWviBQSE3/pieces/
000003.log  CURRENT  LOCK  LOG  MANIFEST-000002
```

You don't need to understand this fully for now, just know that it happened. Two subfolders, one being the original folder you saw when you instantiated OrbitDB, and now another that has the same address as your database.

#### What else happened in the browser?

Similarly, a new IndexedDB database was created to hold your OrbitDB-specific info, apart from the data itself which are 
still stored in IPFS.

![An image showing the IPFS and OrbitDB IndexedDB databases in Firefox](../images/ipfs_browser_2.png)

This shows you one of OrbitDB's core strenths - the ability to manage a lot of complexity between its own internals and tht of IPFS, providing a clear and clean API to manage the data that matters to you.

## Choosing a data store

OrbitDB organizes its functionality by separating different data management concerns, schemas and APIs into **stores**. We chose a `docstore` for you in the last chapter, but after this tutorial it will be your job to determine the right store for the job.

At your disposal you have:

- **[log](https://github.com/orbitdb/orbit-db/blob/master/API.md#orbitdblognameaddress)**: an immutable (append-only) log with traversable history. Useful for *"latest N"* use cases or as a message queue.
- **[feed](https://github.com/orbitdb/orbit-db/blob/master/API.md#orbitdbfeednameaddress)**: a mutable log with traversable history. Entries can be added and removed. Useful for *"shopping cart"* type of use cases, or for example as a feed of blog posts or "tweets".
- **[keyvalue](https://github.com/orbitdb/orbit-db/blob/master/API.md#orbitdbkeyvaluenameaddress)**: a key-value database just like your favourite key-value database.
- **[docs](https://github.com/orbitdb/orbit-db/blob/master/API.md#orbitdbdocsnameaddress-options)**: a document database to which JSON documents can be stored and indexed by a specified key. Useful for building search indices or version controlling documents and data.
- **[counter](https://github.com/orbitdb/orbit-db/blob/master/API.md#orbitdbcounternameaddress)**: Useful for counting events separate from log/feed data.

Each OrbitDB store has its own specific API methods to create, delete, retreieve and update data. In general, you can expect to always have something like a `get` and something like a `put`. 

Also, users of OrbitDB can write their own stores if it suits them. This is an advanced topic and is covered in Part 3 of this book.

## Key Takeaways

* OrbitDB is a distributed database layer which stores its raw data in IPFS
* Both IPFS and OrbitDB work offline and online
* OrbitDB instances have an _ID_ which is the same as the underling IPFS node's ID.
* OrbitDB instances create databases, which have unique _addresses_
* Basic access rights to OrbitDB databases are managed using access control lists (or ACLs), based on the ID of the IPFS node performing the requests on the database
* OrbitDB database addresses are hashes of the database's ACL, its type, and its name.
* Since OrbitDB and IPFS are written in JavaScript, it is possible to build isomorphic applications that run in the browser  and in node.js 
* OrbitDB manages needed flexibility of schema and API design in functionality called **stores**.
* OrbitDB comes with a handful of stores, and you can write your own.
* Each store will have its own API, but you will generally have at least a `get` and a `put`

Now that you've laid the groudnwork, you'll learn how to work with data! Onward, then, to [Chapter 2: Managing Data](./02_Managing_Data.md).

* Resolves #[367](https://github.com/orbitdb/orbit-db/issues/367)
* Resolves #[366](https://github.com/orbitdb/orbit-db/issues/366)
* Resolves #[502](https://github.com/orbitdb/orbit-db/issues/502)

**Note:** Please complete [Chapter 1 - Laying the Foundation](./01_Basics.md) first. 

# Chapter 2 - Managing Data

> Managing data in OrbitDB involves  _loading databases into memory_, and then _creating_, _updating_, _reading_, and _deleting data_.

- [Loading the database](#loading-the-database)
- [Adding data](#adding-data)
- [Reading data](#reading-data)
- [Updating and deleting data](#updating-and-deleting-data)
- [Storing media files](#storing-media-files)
- [Key Takeaways](#key-takeaways)

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
  async deletePieceByHash() { }
  getAllPieces() {}
  getPiecesByInstrument() { }
  getPieceByHash() { }
  await updatePieceByHash()
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
const cid = NPP.addNewPiece("QmNR2n4zywCV61MeMLB6JwPueAPqheqpfiA4fLPMxouEmQ")
const content = await NPP.node.dag.get(cid)
console.log(content.value.payload)
```

Running this code should give you something like the following output. Hold steady, it's overwhelming but it will make sense 
after we explain what happened. For more information see Part 3.

```json
{
  "op":"PUT",
  "key":"QmNR2n4zywCV61MeMLB6JwPueAPqheqpfiA4fLPMxouEmQ",
  "value": {
    "hash":"QmNR2n4zywCV61MeMLB6JwPueAPqheqpfiA4fLPMxouEmQ",
    "instrument":"Accordion"
  }
}
```
### What just happened?

* `piecesDb.put({ ... })` is the most important line here. This call takes an object to sture and returns a _mutlihash_, which is the hash of the content added to IPFS. 
* `node.dag.get(hash)` is a function that takes a Content ID (CID) and returns content. 
* `"op": "PUT"`is a notable part of the output. At the core of OrbitDB databases is the **OPLOG**, where all data are stored as a log of operations, which are then calculated into the appropriate schema for application use. The operation is specified here as a `PUT`, and then the `key`/`value` pair is your data.

> **Note:** "dag" in the code refers to the acronym DAG, which stands for Directed Acyclic Graph. This is a data structure that is, or is at least closely related to Blockchain. More on this in Part 4

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

These are all stored in the global IPFS network so you can find any piece by visiting a public gateway such as `ipfs.io` and adding the IPFS multiaddress to the end of the URL like so: https://ipfs.io/ipfs/QmYPpj6XVNPPYgwvN4iVaxZLHy982TPkSAxBf2rzGHDach

## Reading data

You've added data to your local database, and now you'll can query it. OrbitDB gives you a number of ways to do this, mostly based on which _store_ you picked.

We gave you a `docstore` earlier, so you can flesh out the all of thet simple `get*****` functions like so. `docstore` also provides the more puwerful `query` function, which we can abstract to write a `getPiecesByInstrument` function:

```javascript
getAllPieces() {
  const pieces = this.piecesDb.get('')
  return pieces
}

getPieceByHash(hash) {
  const singlePiece = this.piecesDb.get(hash)[0]
  return singlePiece
}

getByInstrument(instrument) {
  return this.piecesDb.query((piece) => piece.instrument === instrument)
}
```

In your application code, you can use these functions it like so:

```javascript
pieces = NPP.getAllPieces()
pleces.forEach((piece) => { /* do something */ })

piece = NPP.getPieceByHash('QmNR2n4zywCV61MeMLB6JwPueAPqheqpfiA4fLPMxouEmQ')
console.log(piece)
```

Pulling a random score from the database is a great way to find random music to practice. Run this code:

```javascript
const pieces = NPP.getPieceByInstrument("Piano")
const randomPiece = pieces[items.length * Math.random() | 0]
console.log(randomPiece)
```

Both `console.log` calls above will return something like this.

```json
{
  "hash":"QmNR2n4zywCV61MeMLB6JwPueAPqheqpfiA4fLPMxouEmQ",
  "instrument":"Accordion"
}
```

### What just happened?

You queried the database of scores you created earlier in the chapter, retrieving by hash and also randomly.

* `pieces.get(hash)` is a simple function that performs a partial string search on your database indexes. It will return an array of records that match. As you can see in your `getAllPieces` function, you can pass an empty string to return all pieces.
* `return this.piecesDb.query((piece) => piece.instrument === instrument)` queries the database, returning. It's most analagous to JavaScripts `Array.filter` method.

> **Note:** Generally speaking, `get` functions do not return promises since the calculation of database state happens at the time of a _write_. This is a trade-off to allow for ease of use and performance based on the assumption that writes are _generally_ less frequent than reads.

## Updating and deleting data

You'll next want to provide your users with the ability to update and delete their pieces. For example if you realize you'd rather practice a piece on a harpsichord instead of a piano, or if they want to stop practicing a certain piece.

Again, each OrbitDB store may have slightly different methods for this. In the `docstore` you can update records by again using the `put` method and the ID of the index you want to update.

```javascript
async updatePieceByHash(hash, instrument = "Piano") {
  var piece = await this.getPieceByHash(hash)
  piece.instrument = instrument
  const cid = await this.piecesDb.put(piece)
  return cid
}
```

Deleting a record by hash is also easy:

```javascript
async deletePieceByHash(hash) {
  const cid = await this.piecesDb.del(hash)
  return cid
}
```

In your application code, you can run these new functions and see the opcodes that return to get a sense of what's going on.

```javascript
const cid = await NPP.updatePiece("QmNR2n4zywCV61MeMLB6JwPueAPqheqpfiA4fLPMxouEmQ", "Harpsichord")
// do stuff with the cid as above

const cid = await NPP.deletePieceByHash("QmNR2n4zywCV61MeMLB6JwPueAPqheqpfiA4fLPMxouEmQ")
const content = await NPP.node.dag.get(cid)
console.log(content.value.payload)
```

While the opcode for PUT will be the same, the opcode for `deletePieceByHash` is not:

```json
{
  "op":"DEL",
  "key":"QmdzDacgJ9EQF9Z8G3L1fzFwiEu255Nm5WiCey9ntrDPSL",
  "value":null
}
```

### What just happened?

You may be thinking something like this: "Wait, if OrbitDB is built upon IPFS and IPFS is immutable, then how are we updating or deleting records?" Great question, and the answer lies in the opcodes  Let's step through the code so we can get to that.

* `this.piecesDb.put` is nothing new, we're just using it to perform an update instead of an insert
* `this.piecesDb.del` is a simple function that takes a hash, deletes the record, and returns a CID
* `"op": "DEL"` is another opcode, `DEL` for DELETE. This log entry effectively removes this key from your records and also removes the content from your local IPFS

## Storing Media Files

We are often asked if it is possible to store media files like pictures or audio directly inside OrbitDB. Our answer is that you should treat this like any other database system and store the _address_ of the 

Luckily, with content addressing in IPFS, this becomes rather easy, and predictable from a schema design standpoint. The overall pattern in:

1. Add the file to IPFS, which will return the _multihash_ of the file
2. Store said multihash in OrbitDB 
3. When it comes time to display the media, use native IPFS functionality to retrieve it from the hash

To see this in action, [download the "Tourian" PDF](https://ipfs.io/ipfs/QmYPpj6XVNPPYgwvN4iVaxZLHy982TPkSAxBf2rzGHDach) to your local file system for use in the next examples

#### On the command line with the go-ipfs or js-ipfs daemon

After following the installation instructions to install [go-ipfs]() or [js-ipfs]() globally, you can run the following command:
 
```bash
$ ipfs add file.pdf
QmYPpj6XVNPPYgwvN4iVaxZLHy982TPkSAxBf2rzGHDach
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

You added some potentially very large media files to IPFS, and then stored the 40-byte addresses in OrbitDB for retrieval and use. You are now able to leverage the benefits of both IPFS and 

> **Note:** IPFS nodes run _inside_ the browser, so if you're adding lots of files via the above method, keep an eye on your IndexedDB usage, since that's where IPFS is storing the blocks. 

## Key Takeaways

* Calling `load()` periodically ensures you have the latest entries from the database
* Generally speaking, a `put` or `delete` will return a Promise (or require `await`), and a `get` will return the value(s) immediately.
* Updating the database is equivalent to adding a new entry to its OPLOG.
* The OPLOG is calculated to give the current _state_ of the database, which is the view you generally interact with
* OPLOGS are flexible, particularly if you're writing your own stores. `docstore` primarily utilizes the `PUT` and `DEL` opcodes
* While you technically _can_ store encoded media directly in a database, media files are best stored in OrbitDB as IPFS hashes
* Keep an eye on IndexedDB size and limitations when adding content to IPFS via the browser.

Of course, in the vast majority of apps you create, you won't just be interacting with one database or one type of data. We've got you covered in [Chapter 3: Structuring Data](03_Structuring_Data.md)

* Resolves #[365](https://github.com/orbitdb/orbit-db/issues/365) 
* Resolves #[438](https://github.com/orbitdb/orbit-db/issues/438)
* Resolves #[381](https://github.com/orbitdb/orbit-db/issues/381)
* Resolves #[242](https://github.com/orbitdb/orbit-db/issues/242)
* Resolves #[430](https://github.com/orbitdb/orbit-db/issues/430)
**Note:** Please complete [Chapter 2 - Managing Data](./02_Managing_Data.md) first. 

# Chapter 3 - Structuring your data

> or, "How you learned to stop worrying and love _nested databases_."

- [Adding a practice counter to each piece](#)
- [Utilizing your practice counter](#)
- [Adding a higher-level user database](#)
- [Updating your user profile](#)

## Adding a practice counter to each piece

Your users may want to keep track of their practice, at minimum how many times they practiced a piece. You'll enable that functionality for them by creating a new OrbitDB `counter` store for each piece, and creating a few new functions inside the `NewPiecePlease` class to interact with the counters.

> **Note:**  The nesting approach detailed here is but one of many, and you are free to organize your data as you see fit. This is a powerful feature of OrbitDB and we are excited to see how people tackle this problem in the future!

Update the `addNewPiece` function to create a `counter` store every time a new piece is added to the database. You can utilize basic access control again to ensure that only a node with your IPFS node's ID can write to it.

```javascript
async addNewPiece(hash, instrument = "Piano") {
  const options = { accessController: { write: [this.orbitdb.identity.publicKey] }}
  const dbName = "counter." + hash.substr(20,20)
  const counterDb = await this.orbitdb.counter(dbName, options)

  const cid = await this.piecesDb.put({
    hash: hash,
    instrument: instrument,
    counter: counterDb.id
  })

  return cid
}
```

In your application code this would look something like this:

```javascript
const cid = await NPP.addNewPiece("QmdzDacgJ9EQF9Z8G3L1fzFwiEu255Nm5WiCey9ntrDPSL", "Piano")
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

### What just happened?

You changed your code to add a new database of type `counter` for each new entry added to the database.

* `  const options = { accessController: { write: [this.orbitdb.identity.publicKey] }}` should be recognizable from Chapter 1. This sets options for the db, namely the `accessController` to give write access only to your node's ID, or public key. `
* `this.orbitdb.counter` creates a new counter type with `options` that provide a write ACL for your IPFS node
* `const dbName = "counter." + hash.substr(20,20)` prepends `counter.` to the truncated database name. See the note below.
* `this.piecesDb.put` is then modified to store the _address_ of this new database for later retrieval similar to the way you  stored media addresses in a previous chapter.
* `"counter":"/orbitdb/zdpuAoM3yZEwsynUgeWPfizmWz5DEFPiQSvg5gUPu9VoGhxjS/counter.fzFwiEu255Nm5WiCey9n"` in the output now reflects this change by storing the _address_ of the new DB for later retrieval and updating.

> **Note:** There is a limit of 40 characters on the names of the databases, and multihashes are over this limit at 46. We still need unique names for each of the databases created to generate unique addresses, so we trim down the hash and prepend
it with `counter.` to get around this limitation.

## Utilizing the practice counter

Now, add a few functions to `NewPiecePlease` that utilize the counters when necessary

```javascript
async getPracticeCount(piece) {
  const counter = await this.orbitdb.counter(piece.counter)
  await counter.load()
  return counter.value
}

async incrementPracticeCounter(piece) {
  const counter = await this.orbitdb.counter(piece.counter)
  const cid = await counter.inc()
  return cid
}
```

These can be used in your application code like so:

```javascript
const piece = NPP.getPieceByHash("QmdzDacgJ9EQF9Z8G3L1fzFwiEu255Nm5WiCey9ntrDPSL")
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

### What just happened?

You created and used two new functions to both read the value of, and increment a `counter`, another type of OrbitDB store.

* `await this.orbitdb.counter(piece.counter)` is a new way of using `this.orbitdb.counter`, by passing in an existing database address. This will _open_ the existing database instead of creating it
* `counter.load()` is called once in `getPracticeCount`, loading the latest database entries into memory for display
* `await counter.inc()` increments the counter, like calling `counter++` would on an integer variable
* `"op":"COUNTER"` is a new operation that you havent seen yet - remember, you can create stores with any operations you want. More on this in Part 3.
* `"counters": { "042985dafe18ba45c7f1a57db.........02ae4b5e4aa3eb36bc5e67198c2d2": 3 }` is the value returned, the long value is an id based on your node's public key

## Adding a higher-level database for user data

Pieces of music to practice with are great to have, but moving forward you will want to allow users to further express themselves via a username and profile. This will also help prepare you for allowing users to connect to each other in the next chapter.

You will create a new database for users, from which your `piecesDb` will be referenced. You can create this database in the `ready` event handler of IPFS, alongside where you declared `piecesDb`.

```javascript
```

### What just happened?

You created a database to store anything and everything that might pertain to a user, and then linked the `piecesDb` to that, nested inside.

## Key Takeaways

* The distributed applications of the future will be complex and require data structures to mirror and manage that complexity.
* Luckily, OrbitDB is extremely flexible when it comes to generating complex and linked data structures
* These structures can contain any combination of OrbitDB stores - you are not limited to just one.
* You can nest a database within another, and you can create new databases to next your existing databases within.
* _Nesting_ databases is a powerful approach, but it is one of many. **Do not** feel limited. **Do** share novel approaches with the community.

And with this, you are now ready to connect to the outside world. Continue to [Chapter 4: Peer to Peer](04_P2P.md) to join your app to the global IPFS network, and to other users! 
**Note:** Please complete [Chapter 3 - Structuring Data](./03_Structuring_Data.md) first. 

## Chapter 4: Peer-to-Peer

### Replication Overview

* Resolves #[463](https://github.com/orbitdb/orbit-db/issues/463)
* Resolves #[468](https://github.com/orbitdb/orbit-db/issues/468)
* Resolves #[471](https://github.com/orbitdb/orbit-db/issues/471)
* Resolves #[498](https://github.com/orbitdb/orbit-db/issues/498)
* Resolves #[519](https://github.com/orbitdb/orbit-db/issues/519)
* Resolves #[296](https://github.com/orbitdb/orbit-db/issues/296)
* Resolves #[264](https://github.com/orbitdb/orbit-db/issues/264)
* Resolves #[460](https://github.com/orbitdb/orbit-db/issues/460)
* Resolves #[484](https://github.com/orbitdb/orbit-db/issues/484)
* Resolves #[474](https://github.com/orbitdb/orbit-db/issues/474)
* Resolves #[505](https://github.com/orbitdb/orbit-db/issues/505)

### Replicating in the Browser
### Replicating in Node.js
### Replication between Browser and Node.js

* Resolves #[496](https://github.com/orbitdb/orbit-db/issues/496)

Now, move on to [Chapter 05 - Identity and Permissions](./05_Identity_Permission.md)
**Note:** Please complete [Chapter 4 - Peer to Peer](./04_P2P.md) first. 

## Chapter 5: Identity and Permissions

### Access Control
### Identity Management
### Security Disclosures

* Resolves: #[397](https://github.com/orbitdb/orbit-db/issues/397)
* Resolves: #[222](https://github.com/orbitdb/orbit-db/issues/222)
* Resolves: #[327](https://github.com/orbitdb/orbit-db/issues/327) 
* Resolves: #[357](https://github.com/orbitdb/orbit-db/issues/357)
* Resolves: #[475](https://github.com/orbitdb/orbit-db/issues/475)
* Resolves: #[380](https://github.com/orbitdb/orbit-db/issues/380)
* Resolves: #[458](https://github.com/orbitdb/orbit-db/issues/458)
* Resolves: #[467](https://github.com/orbitdb/orbit-db/issues/467)

## Conclusion

The end!
# The OrbitDB Tutorial

> An interactive, imperative and isometric JavaScript adventure of peer-to-peer, decentralized, and distributed proportions

## Requirements

* A computer
* A command line (unix/linux based or windows command prompt)
* A modern web browser (Firefox, Chrome, Edge, etc)
* Node.js installed

## What will I build?

You will build an app that provides royalty-free sheet music on-demand for musicians, based on their instrument. 

You will access a global catalog of royalty-free sheet music. Then, given an instrument name as input (Violin, Saxophone, Marimba) you it will display piece of sheet music at random. Futhermore, you will give the users the ability to submit their own music and share it with connected peers.

You will use OrbitDB as the backbone for this, creating a few databases:
1. The "global" starter database of royalty free pieces for all to use (read only)
2. The user database of pieces they can upload - private

You will write JavaScript and create the backbone of a full application using OrbitDB in both the
browser and on the command line. For the sake of keeping things focused, we will exclude any
HTML or CSS from this tutorial and focus only on the Javascript code.

### Why a music app?

OrbitDB is already used all over the world, and this tutorial music reflect that. There are other many topics we could
have chosen that touch the vast majority of humans on earth: finance, politics, climate, religion. However, those are
generally contentious and complicated.

We believe that **music** is a uniquely universal cultural feature - something that we more humans than any other topic
share, enjoy, or at least appreciate. Your participation in this tutorial will make it easier for musicians all over the
world to find sheet music to practice with.

## Conventions

* Read this tutorial in order, the learning builds on itself other over time.
* You will switch between writing and reading code, and *What Just Happened* sections that explain in depth what happens on a technical level when the code is run.
* OrbitDB works in both node.js and in the browser, and this tutorial will not focus on one or the other. Stay on your toes.
* This tutorial is not only OS-agnostic and editor-agnostic, it's also folder structure agnostic. All of the code examples are designed to work if applied in order, regardless of which js file they are in. Thus folder and file names for code are avoided.
* `async` and `await` are used prominently. Feel free to replace those with explicit `Promise` objects if you're feeling daring.

Ready? Let's start with [Chapter 1: Laying the Foundation](./01_Basics.md)



