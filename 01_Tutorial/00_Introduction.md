# Part 1: The OrbitDB Tutorial

> An interactive, imperative and isometric JavaScript adventure of peer-to-peer, decentralized, and distributed proportions

## Introduction

### Requirements

* A computer
* A command line (unix/linux based or windows command prompt)
* A modern web browser (Firefox, Chrome, Edge, etc)
* node.js (optional)

### What will I learn?

TODO: Description of tutorial chapters, after they are written

### What will I build?

If you're a musician like many of us are, you probably need form of _sheet music_ to practice. While any musician tends to spend hours practicing _alone_, the beauty of music is its ability to _connect_ musicians to play _together_ - duets, trios, quartets, septets, all the way up to orchestras.

These self-organizing clusters of musicians will always need better way to share common and necessary sheet music with each other. What better use case for a peer-to-peer application?

Using OrbitDB as the backbone, you will build this application. It will allow people to import and maintain a local collection of their own sheet music in the form of PDF files. More importantly, they will be able to _share_ this music by letting them interface with _peers_, and search across multiple distribute databases at once for music. For fun, and for users who are just looking for something to-sight read, you will give them a magic "button" that, given an instrument, will display piece of sheet music at random from their collection.

#### Why a music app?

OrbitDB is already used all over the world, and this tutorial music reflect that. There are other many topics we could
have chosen that touch the vast majority of humans on earth: finance, politics, climate, religion. However, those are
generally contentious and complicated.

We believe that **music** is a uniquely universal cultural feature - something that we more humans than any other topic
share, enjoy, or at least appreciate. Your participation in this tutorial will make it easier for musicians all over the
world to find sheet music to practice with.

### Conventions

* Read this tutorial in order, the learning builds on itself other over time.
* Type the examples in, don't copy and paste.
* **What just happened?** sections are interspersed to that explain in depth what happens on a technical level
* This tutorial attempts to be as _agnostic_ as possible in terms of:
  * Your operating system. Some command line commands are expressed as unix commands, but everything here should work on Windows as well.
  * Your folder structure. All of the code here is written in a single file, `newpieceplease.js`
  * Your editor. Use whatever you want.
  * Your UI layer. You will see _examples_ of how the code will be used on the UI layer, be it command line or browser based, but you will not be building out the UI as part of the tutorial steps.
* `async` and `await` are used prominently. Feel free to replace those with explicit `Promise` objects if you're feeling daring.
* Steps that **you** should complete are represented and hightlighted as _diffs_. Example application code is represented as Javascript  
* For the sake of keeping things focused, we will exclude any HTML or CSS from this tutorial and focus only on the Javascript code.

<strong>Ready? Let's start with [Chapter 1: Laying the Foundation](./01_Basics.md)</strong>
