# Implementing a custom Access controllers
And after these things, let us now consider
how we might implement a custom access controller.

Starting with the rules, that we want
to implement:
- The creator should be the only one to upload notes pieces.
- Anyone can comment by default.
- The author of a comment and the creator can delete a comment.
- The creator can ban somebody from commenting on the entire database.

## Implementation
Similarly to the `Store`s,
Access Controllers are implemented
using inherited classes.
Let's implement a `NotesAccessController.js`
file with these Isomorphic bookends:
```js
