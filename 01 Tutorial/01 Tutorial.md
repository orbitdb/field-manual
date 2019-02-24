# The OrbitDB Tutorial

> An imperative, isomorphic romp where you create a peer-to-peer music application.

**Requirements**: A *computer* with a *web browser*, *command line*, and *node.js* installed? 

**Conventions**

* Try to read the tutorial in order - concepts are introduced purposfully over time
* The general format will oscillate between writing and reading code, and *What Just Happened* sections that explain in depth what happens on a technical level when the code is run.
* OrbitDB works in both node.js and in the browser, and this tutorial will not focus on one or the other. Stay on your toes.

### What am I building?

You'll build, step by step, an app that provides royalty-free sheet music on demand for musicians.

There will be a repository of royalty-free sheet music, and it will display piece of sheet music at random on a per-instrument basis. Users can also submit music and share music between other users and groups of users.

You will now use OrbitDB to create a full app that contains:
This app will be local-first, offline-first, and peer-to-peer in its connectivity. There will
be a few databases:
* A database of royalty-free sheet music for your instrument
1. The "global" starter database of royalty free pieces for all to use (read only)
2. The user database of pieces they can upload - private

You will write JavaScript Code create the backbone of a full application using OrbitDB in both the
browser and on the command line. For the sake of keeping things focused, we will exclude any
HTML or CSS from this tutorial and focus only on the Javascript code.

### Why a music app?

OrbitDB is already used all over the world, and it's important that in our tutorials and
discussions reflect that by not picking focii that inadvertently exclude people. Music is
one of the few features and fields of study that all cultures on earth share. There are
other topics: finance, politics, maybe religion, but there are other apps to focus on those.
Ours will make it easier for musicians all over the world to find sheet music to practice with.

The working title is **New Piece, Please!** Read on and build it.

## Chapter 1: The Basics

The basics of OrbitDB include creating databases, choosing data types, and reading and writing data.

Finally, since all of these activities can happen offline and locally, without being connected to any peers at all, these steps will all take place offline. 

### Installing and Instantiating OrbitDB

Require OrbitDB and IPFS in your program and create the instances:

#### Installation in Node.js

To use these modules in node.js, first create your project directory and use npm to install
`orbitdb` and its dependency `ipfs`

From the command line:
```bash
$ npm install orbitdb ipfs
```

Then, in a script called `server.js`, require the modules:

```javascript
// server.js

const Ipfs = require('ipfs')
const OrbitDB = require('orbit-db')
```

#### Installation in the Browser

There are a few different places you can get browser packages for ipfs and orbitdb. These are detailed in Part 3 of this book. For the purposes of this tutorial, we recommend using unpkg for both.

Simply include these at the top of your `index.html` file:

```html
<script src="https://unpkg.com/ipfs/dist/index.min.js"></script>
<script src="https://www.unpkg.com/orbit-db/src/OrbitDB.js"></script>
```

### Creating IPFS and OrbitDB instances

Let's start with the following code. We'll try to keep the code in bite sized chunks. We are also going to start "offline",
purposefully not connecting to any other peers until we absolutely need to.

OrbitDB's syntax is almost always identical between the browser and in node.js, so this code will work in both places:

```javascript
let orbitdb

let ipfs = new Ipfs({
  preload: { enabled: false },
  repo: "./ipfs",
  EXPERIMENTAL: { pubsub: true },
  config: {
    Bootstrap: [],
    Addresses: { Swarm: [] }
  }
});

ipfs.on("error", (e) => { throw new Error(e) })
ipfs.on("ready", () => {
  orbitdb = new OrbitDB(ipfs)
  console.log(orbitdb.id)
})
```

You see the output, something called a "multihash", like `QmPSicLtjhsVifwJftnxncFs4EwYTBEjKUzWweh1nAA87B`. For now, just know that this is the identifier of your node. Multihashes are explained in more detail in the **Part 2: Peer-to-Peer**

### What Just Happened?

Starting with the `new Ipfs` line, your code creates a new IPFS node. Note the default settings:

* `preload: { enabled: false }` disables the use of so-called "pre-load" IPFS nodes. These nodes exist to help load balance the global network and prevent DDoS. However, these nodes can go down and cause errors. Since we are only working offline for now., we include this line to disable them.
* `repo: './ipfs'` designates the path of the repo in node.js only. In the browser, you can actually remove this line. The default setting is a folder called `.jsipfs` in your home directory. You will see why we choose this acute location for the folder later.
* `XPERIMENTAL: { pubsub: true }` enables IPFS pubsub, which is a method of communicating between nodes and is required for OrbitDB usage, despite whether or not we are connected to other peers.
* `config: { Bootstrap: [], Addresses: { Swarm: [] }}` sets both our bootstrap peers list (peers that are loaded on instantiation) and swarm peers list (peers that can connect and disconnect at any time to empty. We will populate these later.
* `ipfs.on("error", (e) => { throw new Error(e) })` implements extremely basic error handling for if something happens during node creation
* `ipfs.on("ready", (e) => { orbitdb = new OrbitDB(ipfs) })` instantiates OrbitDB on top of the IPFS node, when it is ready.

By running the code above, you have created a new IPFS node that works locally and is not connected to any peers.
You have also loaded a new orbitdb object into memory, ready to create databases and manage data.

*You are now ready to use OrbitDB!*

* Resolves #[367](https://github.com/orbitdb/orbit-db/issues/367)

### What else happened in node.js?

When you ran the code in node.js, you created two folders in your project structure: `'orbitdb/` and `ipfs/`. 

```bash
$ # slashes added to ls output for effect
$ ls orbitdb/
QmNrPunxswb2Chmv295GeCvK9FDusWaTr1ZrYhvWV9AtGM/

$ ls ipfs/
blocks/  config  datastore/  datastore_spec  keys/  version
```

Focusing your attention on the IPFS folder, you will see that the subfolder has the same ID as orbitdb. This is purposeful, as this initial folder contains metadata that OrbitDB will need to operate.

The `ipfs/` folder contains all of your IPFS data. Explaining this in depth is outside of the scope of this tutorial, and the curious can find out more [here](#). 

### What else happened in the browser?

In the browser IPFS content is handled inside of IndexedDB, a persistent storage mechanism for browsers

Note since you have not explicitly defined a database in the broser, no IndexedDB databases have been created for OrbitDB yet.

**Caution!** iOS and Android have been known to purge IndexedDB if storage space needs to be created inside of your phone. We recommend creating robust backup mechanisms at the application layer.

## Creating a Database


* Resolves #[366](https://github.com/orbitdb/orbit-db/issues/366)
* Resolves #[502](https://github.com/orbitdb/orbit-db/issues/502)

### Choosing a data type

* Resolves #[481](https://github.com/orbitdb/orbit-db/issues/481)
* Resolves #[480](https://github.com/orbitdb/orbit-db/issues/480)
* Resolves #[400](https://github.com/orbitdb/orbit-db/issues/400)
* Resolves #[318](https://github.com/orbitdb/orbit-db/issues/318)
* Resolves #[503](https://github.com/orbitdb/orbit-db/issues/503)

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

## Chapter 3: Identity and Permissions

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
