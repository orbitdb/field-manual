# Defining the Index
In the last chapter we
considered how we
could define our
Index data structure.

I settled us on a
Tree data structure,
where each notes piece
are a root and the comments
would be children of that
root.

We then laid out the skeleton
code for the Index and
in this chapter we will
actually define the Index
or what makes the `NotesIndex`
class an `Index`.


## A few utility functions.
Let's first define a few
utility functions for fetching content from
the Index.
- Fetching a notes piece.
- Fetching the comments on a piece of notes
- Getting comments in a chronological order for a specific piece of notes.

The last will be very helpful to those poor UI Designers,
who have to translate this data structure into
pleasant UI.

### `getNotes`
But let's start with a simple `NotesIndex.getNotes` function.
```js
getNotes(cid) {
  return this._index[cid].data
}
```

We fetch the tree with that CID and then only
care for the `data` field of the `TreeNode`, because
that's where the notes is actually stored.

### `getComments`
Now implement the `NotesIndex.getComments(cid)` function like this:
```js
getComments(cid) {
  return this._index[cid].children
}
```
Get comments is almost entirely identical to `getNotes`, except
that we don't return the `data`, but the `children` field of
the `TreeNode`.

### `getComments` with chronological order
Now, let's get to our third and final `get` functions: `getComments`,
but now with an argument: `flat = true`.
The purpose of this function is, to if the `flat` argument
is true, flatten the comments into a neat chronological
list, that can be easily displayed.
To do this, we first gather all of the comments into an array
and then sort them based on an ever increased `id` field:

```js
getComments(cid, flat = true) {
  function flatten(children) {
    return children.reduce((comments, comment) => {
      comments.push(comment.data)
      return comments.concat(flatten(comment.children))
    }, [])
  }

  if(flat) {
    return flatten(this._index[cid].children).sort((a, b) => a.id - b.id)
  } else {
    return this._index[cid].children
  }
}
```
Replace the `getComments` function above, by this.

#### What happens here?
We first define a helper function `flatten`, which goes
through the array of children and adds each node
of the tree therein to a flat array.
Then we sort it based on an id field in ascending order.
If you pass in `flat = false`, you'll still get the old
behavior.


### The `updateIndex` function
Up until this point, we have been
writing utility functions, that are
nice to have for our index to be used
by our still to be defined store,
but is not strictly necessary for
an `Index` to work as such.

The only method all `Index` classes
have to have is `updateIndex`.

`updateIndex` receives as an argument the `oplog` of
database, which is an Array of Operations compiled
from the `ipfs-log` in chronological order.

So, let's lay out the skeleton:
```js
updateIndex(oplog) {
  let order = 0
  oplog.values.reduce((handled, item) => {
    if(!handled.includes(item.hash)) {
      handled.push(item.hash)

      switch (item.payload.op)) {
        case "ADDNOTES":

          break;
        case "DELETENOTES":

          break;
        case "ADDCOMMENT":

          break;

        case "DELETECOMMENT":

          break;
        default:

      }
    }
  }, [])
}
```
The `updateIndex` starts with a line, that
initializes an `order` variable to 0.
This will help us, when we get to `ADDCOMMENT`.

We start by reducing the `oplog.values` Array.
The accumulator of the reducer contains
the hashes of the items, that have already been handled.
The current item is checked, not to have been handled already
and is then added to the handled array.

After this, the handling actually starts.
We use a switch statement to handle the
item's differently based on the `op` value.
As we discussed in the previous chapter,
there are four operations, that this
Index can handle:
- `ADDNOTES` to add a new piece of notes.
- `DELETENOTES` to delete a piece of notes.
- `ADDCOMMENT` to add a comment to a piece of notes or some other comments.
- `DELETECOMMENT` to delete a comment.

### Implementing `ADDNOTES` handling
Add notes is by far the simplest operation to handle,
since we just need to add a new `TreeNode` to the `_index`.
```js
case "ADDNOTES":
  this._index[item.hash] = new TreeNode(item.payload.value)

  break;
```

### Implementing `DELETENOTES` handling
And deleting notes is the inverse:
```js
case "DELETENOTES":
  delete this._index[item.hash]

  break;
```

### Implementing `ADDCOMMENT` handling
Adding comments is a little more complicated.
We first have to find the parent of the comment in the notes
or among the comments themselves.

To do this properly in adequate time, we have
to add a `_comments` property to our `Index` in the `constructor`:
```js
constructor() {
  this._index = {}
  this._comments = {}
}
```

In this object, we store each comment's `TreeNode` by it's hash or rather
the hash of the Operation Item, that added them for easy access.
```js
case "ADDCOMMENT":
  let reference = item.payload.key
  let node = {
    comment: item.payload.value,
    author: item.identity.id,
    id: order
  }
  order++

  if(this._index[item.payload.key] !== undefined) {
    node = this._index[item.payload.key].addChild(node)

  } else if(this._comments[item.payload.key] !== undefined){
    node = this._index[item.payload.key].addChild(node)
  } else {
    break;
  }

  this._comments[item.hash] = node

  break;
```
This branch of the `ADDCOMMENT` switch starts
by utilizing the `key` field of the Operation,
which is interpreted as the hash of the notes pieces
or the comments.
Then the node of the comment is created, containing
both the comment, an `author` field and an `id` field.
The `author` field is set to the ID of the OrbitDB instance
that is passed to the operation and already verified by OrbitDB.

And for the `id` we use the `updateIndex`-wide `order` variable,
which is incremented afterwards.
Because the `order` variable is increased for each comment
on each note. This makes it possible to sort the comments in `getComments`.

After this, the `TreeNode`, that is referred to by the Operator's
`key` field, gets a new child in the form of the comment.

And at last, we store the created `TreeNode`, in `_comments`
for later.

### Implementing `DELETECOMMENT` handling
After the monster of a branch above, this case is
pretty relaxing in comparison:
```js
case "DELETECOMMENT":
  let comment = item.payload.key
  delete this._comments[item.hash]

  break;
```

## Conclusion
We have now defined the complete
Index for the comment system.
You can now read it through the `getNotes` and `getComments`.

But we haven't discussed two topics yet:
- How do you add data to the database?
- And how can you ensure, that the database isn't modified incorrectly? How can we ensure that user A doesn't delete the comment of user B?

Both of those question will be addressed
in the next chapters of this Tutorial.
First, in the Store chapters, we discuss,
how you can add data to the database.

And in the chapters about the
Access Controller we will at the end
of this Tutorial discuss, how
you can control, how can change what
in your databases.

**Next: [Defining the Store](04_Defining_the_Store.md)**
