## On Customizing OrbitDB

In conclusion this
part of the Field
Manual of OrbitDB
tried to introduce
the reader to
customizing the
OrbitDB Stores
by defining `Index`
and `Store` types.

It started with the
`Index` to define the
current working state
of the database.

Here the tutorial
was trying to
introduce the parsing
of the `oplog` - an Array of Operations -
to create this state.

After the `Index` - state of the database -
being defined, the tutorial defines
a `Store` class.

The `Store` class does not
manage the current state,
but uses the `Index`
to create an easy to use
API for a User, who just
wants to use the Database
and has no time to bother
about CRDTs, `oplogs` and
other such complexities.

### Where to go from here?

The source code in this
tutorial is incomplete
by design.
You can extend it,
add more features,
change the API or parse
the state differently.

Some ideas, that you could
pursue - but don't have to:

- Event Handling: Firing events when receiving *new* comments, notes and deleting old ones.
- Make it possible to edit comments.
- Use a different data structure to represent the comments: A lazy hash table, where each notes piece and comment can be looked up and parsed upon request, instead of upon receiving new entries.
- Use a different delete heuristic: Don't delete comments, if the comments or music sheets they refer to are deleted. Do something else! Maybe move them up the tree or put them into a `detached comments` array. It's a question of your imagination.

You are free to change the source code here however
you want.
If you want to compare the code, that you
have written over the course of this
Tutorial with the code, we used
to create this tutorial, you
can download the final version of the
code here: [final](../code_examples/05_Customizing_OrbitDB/final).

We also have an Appendix
to this part of the tutorial,
that describes how you can
implement Moderation.

If you want to read that,
go to this: **[Moderating your Comment Threads.](06_Moderation.md)**
