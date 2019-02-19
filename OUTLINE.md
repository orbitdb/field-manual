# The OrbitDB Field Manual

*Overall the book is written in 2nd person: You do this, you should know, etc. Parts 1 and 3 are practical, and Parts 2 and 4 are theoretical *
 
# Introduction

## Preamble [1p] 
Sets the book up with a very loose but catchy narrative about our distributed future and why persistent-yet-malleable data structures are necessary.

## What is OrbitDB? [3p]

Non-technical description of OrbitDB. For the technical, we point to Part 1 for a tutorial and part 3 for overall architecture. Briefly touch upon IPFS context.

* Resolves #[527](https://github.com/orbitdb/orbit-db/issues/527)
* Resolves #[492](https://github.com/orbitdb/orbit-db/issues/492)

## What can I use it for [2p]

What has already been built with OrbitDB? What can one do with a distributed database like OrbitDB? What apps should be built? Points to Part 2 for ways of thinking distributed.

* Resolves #[248](https://github.com/orbitdb/orbit-db/issues/248)
* Resolves #[239](https://github.com/orbitdb/orbit-db/issues/239)
* Resolves #[406](https://github.com/orbitdb/orbit-db/issues/406)
* Resolves #[246](https://github.com/orbitdb/orbit-db/issues/246)
* Resolves #[148](https://github.com/orbitdb/orbit-db/issues/148)
* Resolves #[354](https://github.com/orbitdb/orbit-db/issues/354)
* Resolves #[427](https://github.com/orbitdb/orbit-db/issues/427)

## A Warning to Fellow Travelers in Our Distributed Future [1p]

This is alpha software. Not just OrbitDB, all of it - an entire industry. Be careful. Points to part 4 for Advanced Topics.

# Part 1: The Tutorial

An upbeat, imperative romp from empty files to complete app in under 100 pages. Need an idea for an app. Constrained entirely to JavaScript to maximize focus - no HTML or CSS

Coding instructions is interleaved with sections called **What Just Happened** that tell people what just happened after their code ran.

## Chapter 1: Getting Started

### Instantiating IPFS and OrbitDB

* Resolves #[367](https://github.com/orbitdb/orbit-db/issues/367)
### Creating a Database

* Resolves #[366](https://github.com/orbitdb/orbit-db/issues/366)
* Resolves #[502](https://github.com/orbitdb/orbit-db/issues/502)

## Chapter 2: Reading and Writing Data

* Resolves #[365](https://github.com/orbitdb/orbit-db/issues/365) 
* Resolves #[438](https://github.com/orbitdb/orbit-db/issues/438)
* Resolves #[381](https://github.com/orbitdb/orbit-db/issues/381)
* Resolves #[242](https://github.com/orbitdb/orbit-db/issues/242)
* Resolves #[430](https://github.com/orbitdb/orbit-db/issues/430)

### Choosing a data type

* Resolves #[481](https://github.com/orbitdb/orbit-db/issues/481)
* Resolves #[480](https://github.com/orbitdb/orbit-db/issues/480)
* Resolves #[400](https://github.com/orbitdb/orbit-db/issues/400)
* Resolves #[318](https://github.com/orbitdb/orbit-db/issues/318)
* Resolves #[503](https://github.com/orbitdb/orbit-db/issues/503)

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

# Part 2: Thinking Peer to Peer

## What this is NOT
### This is not Bittorrent
### This is not Git
### This is not Kazaa
### Comparison to Traditional Database Systems
#### On Sharding

### What this is

* Resolves #[536](https://github.com/orbitdb/orbit-db/issues/536)
## On Performance and Scalability

* Resolves #[241](https://github.com/orbitdb/orbit-db/issues/241)
* Resolves #[479](https://github.com/orbitdb/orbit-db/issues/479)
* Resolves #[402](https://github.com/orbitdb/orbit-db/issues/402)

## Persistence and Validation

* Resolves #[36](https://github.com/orbitdb/orbit-db/issues/36)
* Resolves #[310](https://github.com/orbitdb/orbit-db/issues/310)
## Interactions with the IPFS Ecosystem

* Resolves #[165](https://github.com/orbitdb/orbit-db/issues/165)
* Resolves #[540](https://github.com/orbitdb/orbit-db/issues/540)
# Part 3: The Architecture of OrbitDB

* Resolves #[342](https://github.com/orbitdb/orbit-db/issues/342) Data persistence on IPFS

## `ipfs-log`

Describes CRDTs and Merkle-Dags

## The stores

### Keyvalue
### Docstore
### Counter
### Log
### Feed

## Workshop: Creating Your Own Store

# Part 4: What Next?

* Resolves #[364](https://github.com/orbitdb/orbit-db/issues/364)
* Resolves #[377](https://github.com/orbitdb/orbit-db/issues/377)
* Resolves #[442](https://github.com/orbitdb/orbit-db/issues/442)
* Resolves #[386](https://github.com/orbitdb/orbit-db/issues/386)
* Resolves #[434](https://github.com/orbitdb/orbit-db/issues/434)
* Resolves #[501](https://github.com/orbitdb/orbit-db/issues/501)
* Resolves #[504](https://github.com/orbitdb/orbit-db/issues/504)

## Appendix 1: CRDTs
