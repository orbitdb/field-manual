# Custom Stores for a comment system
When we last left off on this source code,
we had developed a Note Sharing App.

We used a `DocumenStore` to store the Notes Files CID
and meta data and a `KeyValueStore` to store a User Profile.

Now, this system is not bad.
And we could extend this system with further
built-in databases for ever more complex combinations
of databases.

Maybe adding a comment system first.
And for each thread of discussion,
we create a new database.

And then we continue to add
a new database for each new function.

But this can become too complex
to manage and organize. 

### Isomorphic bookends
You should be able to
work in the browser and
on NodeJS.
