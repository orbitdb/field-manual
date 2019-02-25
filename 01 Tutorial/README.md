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

Ready? Let's start with [Chapter 1: The Basics](./01 The Basics.md)
