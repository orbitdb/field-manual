# Defining the Store Interface with your Application
In the last chapter, we have seen, that OrbitDB
Stores are defined as classes and inherit
from another store.

You can choose one of these Stores to inherit from for
your own custom Store, but we'll use the `DocumentStore`:

1. `Store`
2. `EventStore`
3. `FeedStore`
4. `DocumenStore`
5. `CounterStore`

If you use them, you'll also be inheriting their
interfaces.
So, if you extend the `EventStore`, your
store will have the same `get`, `put` and `iterator`
functions and they will work exactly the same,
unless you override them.
