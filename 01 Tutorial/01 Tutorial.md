# The OrbitDB Tutorial

In this chapter you will create the backbone of a full application using OrbitDB in both the
browser and on the command line. For the sake of keeping things focused, we will exclude any
HTML or CSS from this tutorial and focus only on the Javascript code.

## Intro: What will we build?

The app we will build will be for musicians. There will be a repository of royalty-free sheet
music, and it will display piece of sheet music at random on a per-instrument basis. Users can
also submit music and share music between other users and groups of users.

This app will be local-first, offline-first, and peer-to-peer in its connectivity. There will
be a few databases:

1. The "global" starter database of royalty free pieces for all to use (read only)
2. The user database of pieces they can upload - private

The working title is **New Piece, Please!**

### Why this app?

OrbitDB is already used all over the world, and it's important that in our tutorials and
discussions reflect that by not picking focii that inadvertently exclude people. Music is
one of the few features and fields of study that all cultures on earth share. There are
other topics: finance, politics, maybe religion, but there are other apps to focus on those.
Ours will make it easier for musicians to practice.

## Chapter 1: Getting Started

> Intro Text

### Instantiating IPFS and OrbitDB

#### Install

Install [orbit-db](https://github.com/orbitdb/orbit-db) and [ipfs](https://www.npmjs.com/package/ipfs) from npm:

```
npm install orbit-db ipfs
```

## Setup

Require OrbitDB and IPFS in your program and create the instances:

### In Node.js

To use these modules in node.js, first create your project directory and use npm to install
`orbitdb` and its dependency `ipfs`

```bash
$ npm install orbitdb ipfs
```

Then, in your script, require the modules:

```javascript
const Ipfs = require('ipfs')
const OrbitDB = require('orbit-db')
```

### In the Browser

There are a few different places you can get browser packages for ipfs and orbitdb, for the
purposes of this tutorial, we recommend using unpkg or jsdelivr for ipfs, and getting orbitdb
from the `/dist` folder of the master branch at github, [here]().

```html
 <script src="https://unpkg.com/ipfs/dist/index.min.js"></script>
```

## Creating IPFS and OrbitDB instances

Let's start with the followin code. We'll try to keep the code in bite sized chunks

```javascript
let orbitdb

let ipfs = new Ipfs({
  preload: { enabled: false },
  EXPERIMENTAL: { pubsub: true },
  config: {
    Bootstrap: [],
    Addresses: { Swarm: [] }
  }
});

ipfs.on("error", (e) => { throw new Error(e) })
ipfs.on("ready", (e) => {
  orbitdb = new OrbitDB(ipfs)
})
```

### What Just Happened?

Instantiate IPFS in Offline mode with empty swarm array to be added later.

A note about "offline" vs "online" in peer to peer.

* Resolves #[367](https://github.com/orbitdb/orbit-db/issues/367)

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


* Resolves #[365](https://github.com/orbitdb/orbit-db/issues/365) 
* Resolves #[438](https://github.com/orbitdb/orbit-db/issues/438)
* Resolves #[381](https://github.com/orbitdb/orbit-db/issues/381)
* Resolves #[242](https://github.com/orbitdb/orbit-db/issues/242)
* Resolves #[430](https://github.com/orbitdb/orbit-db/issues/430)


## Chapter 3: Peer-to-Peer Replication

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

## Chapter 4: Identity and Permissions

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
