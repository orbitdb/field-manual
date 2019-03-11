# Part 1: The OrbitDB Tutorial

> An interactive, imperative and isometric JavaScript adventure of peer-to-peer, decentralized, and distributed proportions

## Introduction

In order to maximize accessibility this tutorial does not favor either node.js or the browser, since the same OrbitDB code runs on both. By following this tutorial step-by-step, your goal will be to build a _library_ in the form of a JavaScript class that empowers a UI developer (CLI or Web) to build out a fully-realized application.

### Requirements

* A computer with a command line (unix/linux based or windows command prompt)
* A modern web browser (Firefox, Chrome, Edge, etc)
* node.js (optional)

### What will I learn?

In the following chapters you will learn the following topics.

1. [Laying the Foundation](./01_Tutorial/01_Basics.md) covers the installation of IPFS and OrbitDB and the basics of database creation.
2. [Managing Data](./01_Tutorial/02_Managing_Data.md) introduces OrbitDB data stores and walks you through basic create, update, and delete methods of OrbitDB.
3. [Structuring Data](./01_Tutorial/03_Structuring_Data.md) suggests some ways to structure multiple orbitdbs into a more robust schema, primary via nesting.
4. [Peer-to-peer, Part 1 (IPFS)](./01_Tutorial/04_P2P_Part_1.md) begins a large discussion of peer-to-peer networking and messaging, starting with the IPFS layer.
5. [Peer-to-peer, Part 2 (OrbitDB)](./01_Tutorial/04_P2P_Part_2.md) adds OrbitDB to the mix through database discovery, connection, and replication.
6. [Identity and Permissions](./01_Tutorial/06_Identity_Permission.md) hardens the library via encryption and distributed identity.

This tutorial is a work in progress, and individuals should feel encouraged to submit pull requests and provide feedback.

### What will I build?

If you're a musician like many of us are, you probably need form of sheet music to practice. While any musician tends to spend hours practicing alone, the beauty of music is its ability to _connect_ musicians to play together - duets, trios, quartets, septets, all the way up to orchestras.

These self-organizing clusters of musicians will always need better ways to share common and necessary sheet music with each other. What better use case for a peer-to-peer application?

Using OrbitDB as the backbone, you will build a JavaScript class that enables such an application. It will allow people to import and maintain a local collection of their own sheet music in the form of PDF files. More importantly, they will be able to _share_ this music by letting them interface with _peers_, and search across multiple distribute databases at once for music. For fun, and for users who are just looking for something to sight-read, you will give them a magic "button" that, given an instrument, will display piece of sheet music at random from their collection.

#### Why a music app?

OrbitDB is already used all over the world, and this tutorial reflects that. There are many other topics we could
have chosen that touch the vast majority of humans on earth: finance, politics, climate, religion. However, those are
generally contentious and complicated.

We believe that **music** is a uniquely universal cultural feature - something that all humans share, enjoy, or at least appreciate. Your participation in this tutorial will make it easier for musicians all over the world to find sheet music to practice with.

### Conventions

* Read this tutorial in order, the learning builds on itself over time.
* The UI Layer of the app is _suggested_, instead of built directly. The tutorial focuses on the building of a single Javascript class which encapsulates all the functionality needed to build the UI layer.
* Type the examples in, do not copy and paste.
* **What just happened?** sections are interspersed to explain in depth what happens on a technical level
* This tutorial attempts to be as _agnostic_ as possible in terms of:
  * Your operating system. Some command line commands are expressed as unix commands, but everything here should work on Windows as well.
  * Your folder structure. All of the code here is written in a single file, `newpieceplease.js`
  * Your editor. Use whatever you want.
  * Your UI layer. You will see _examples_ of how the code will be used on the UI layer, be it command line or browser based, but you will not be building out the UI as part of the tutorial steps.
* `async` and `await` are used prominently. Feel free to replace those with explicit `Promise` objects if you're feeling daring.
* Steps that **you** should complete are represented and highlighted as _diffs_. Example application code is represented as Javascript  
* For the sake of keeping things focused, we will exclude any HTML or CSS from this tutorial and focus only on the Javascript code.

<strong>Ready? Let's start with [Chapter 1: Laying the Foundation](./01_Basics.md)</strong>
