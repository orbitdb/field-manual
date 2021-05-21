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

So, why should you define your own custom stores?

#### Advantages of Custom Stores
- You can create your own interface functions. (Instead of the standard `get`, `put` and `iterator`)
- You can implement your own data structure to use in local storage and optimize these for your use case.
- You can implement encryption and decryption more easily.

And why shouldn't you?
### Disadvantages
- You will have to learn about a lot of OrbitDB internals. (This can be seen as an advantage by some)
- You will have to test your own data types and ensure, they actually are a CRDTs.

It is on you and your use case, to determine
whether you need a custom store.

If you think you don't, maybe just read on or skip to [chapter 4 about custom
Access Controllers](04_AccessControllers.md), since that may still be interesting for you.

### Isomorphic bookends
You should be able to
work in the browser and
on NodeJS.
