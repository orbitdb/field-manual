## Moderating your Comment Threads.

We have now gotten a store that
you can publish notes and comments with.

But we have not implemented any method
for moderating the Threads.

That's the subject of this Appendix: 
Moderation of the Threads.

### Access Controllers vs. Validation
There are two ways I considered for implementing
moderation in OrbitDB:
1. Access Controllers
2. Validation

#### Access Controllers
Access Controllers (ACL) are used to check if an
entry should become part of the `oplog` or not.

They do this by implementing a `canAppend(entry, identityProvider)` function
that returns true if the entry can be added.

But Access Controllers are very low-level, because they
can't consider the state of the store that the oplog is for.

Thus most complicated Access Rules can actually not be implemented
using Access Controllers. Including the Moderation of the Threads
of the notes store.

I think you should not try to implement any Access Rules using
ACLs unless you really understand what you are doing and know
what you want to achieve.

### Validation
Instead of an ACL I will use validation to achieve moderation.
This means implementing Moderation in the Index of the NotesIndex
before applying an entry.

With this method I can access the state of the Index to validate an entry,
but it also means that invalid entries will persist and be replicated
across the network. Because validation happens on the existing oplog, instead
of before creating the oplog.

**Next: [Implementing a custom AccessController](06_Implementing_a_custom_AccessController.md)**
