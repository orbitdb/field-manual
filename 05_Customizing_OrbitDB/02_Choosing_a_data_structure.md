## Choosing a data structure

Let's start implementing a comment system
by choosing how we want to represent the
comments in the Index.

Choosing a data structure first
and working our way outwards to
the store API, that best fits
to the data structure and then
implementing the Access Controller,
since the Access Controller is very
much independent from the Store and Index.

### Requirements

Our data structure should achieve two things:

- It should store the CID of the sheet music and a string denoting the instrument.
- It should also store the comments, which themselves refer to a sheet music CID or a previous comment.

The simplest data structure that could fulfill these
requirements would be a collection of trees.
Each tree's root would be the Notes pieces and the
children of that root would be the comments,
the comments' comments and so on and so on.

### Generating the Trees from the `ipfs-log`

Before starting to implement this data structure,
we'll also have to consider, how to generate
these trees from the oplog or `ipfs-log`.

In the index, we'll see the oplog as an
Array of operations, each containing these fields:

- `op` to denote the operation being made
- `key` some key, that we can set if we so choose.
- `value` the value of the actual operation.

For our purposes there can be these operations:

- `ADDNOTES` to add a new piece of notes.
- `DELETENOTES` to delete a piece of notes.
- `ADDCOMMENT` to add a comment to a piece of notes or some other comments.
- `DELETECOMMENT` to delete a comment.

This seems pretty straight forward.

### What happens when we delete notes or comments, with all those comments referring to them?

I propose using a simple rule: If a comment or piece of notes
is deleted, all those refering to it are deleted too.
Otherwise this tutorial becomes a complicated mess.

## Implementing the Index.

Let's start by adding a new file to your project folder (if you haven't yet created one, do that now).

### Isomorphic Bookends.

You know the drill, before starting with the actual implementation
of the Index, we have to define the bookends that make our code
work in the browser and in NodeJS:

```js
"use strict"

try {
  module.exports = NotesIndex
} catch (e) {
  window.NotesIndex = NotesIndex
}
```

Not that complicated, really.
Because an Index does not actually depend on
libraries from OrbitDB.

It is using duck typing, instead of inheritance.

### Defining the `NotesIndex` class.

Next, let's define the actual class
of the `NotesIndex`.
Add this to your file, between the bookends and the `use strict`.

```js
class NotesIndex {
  constructor() {
    this._index = {}
  }
}
```

We initialize the index to an empty object at first, because
we don't yet have any data.

### Defining the `TreeNode` helper class.

After this, let's first implement our own `TreeNode` data type,
that'll be used to represent the trees mentioned above.

Because Trees are fundamentally recursive data structures,
a Tree and a `TreeNode` are the same thing.
Both hold some data and have some children, who
are of type `TreeNode`.

```js
class TreeNode {
  constructor(data) {
    this.data = data
    this.children = []
  }

  addChild(data) {
    let node = new TreeNode(data)
    this.children.push(node)
    return node
  }
}
```

With this utility class, we can now get on to implementing the Index
API.

**[Next: Defining the Index](03_Defining_the_Index.md)**
