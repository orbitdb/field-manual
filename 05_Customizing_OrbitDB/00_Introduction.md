# Customizing OrbitDB
In the first chapter of this Field Manual,
we described how you might create
a couple of built-in OrbitDB databases
and write code to modify it.

We shall try to build on this t0utorial
to show you, how you can customize
the built-in OrbitDB stores, access controllers
and indices or how you can define your own.

In order to do this, we will follow this agenda:

1. [Defining the `Store`, `AccessController` and `Index`.](01_Definitions.md)
2. [Creating custom Access Controllers.](02_AccessController.md)
3. [Creating a custom store.](03_Store.md)
4. [Creating a custom index.](04_Index.md)


## What will we implement?
We have already implemented a note sharing app,
where musicians can upload and share their
notes as files and view those of other
musicians.

But what they cannot do, is
cooperate with each.
And isn't it with cooperation,
that the greatest strengths of
the internet come to bear?

So we want to allow our users
to not just share musical notes,
but also comment on each others
notes and discuss them.
