# Part 5: Customizing OrbitDB

In the first chapter of this Field Manual,
we described how you might create
a couple of built-in OrbitDB databases
and write code to modify it.

We shall try to build on this tutorial
to show you, how you can customize
the built-in OrbitDB stores and
indices or how you can define your own.

## What will we implement?

We have already implemented a sheet music sharing app,
where musicians can upload and share their
notes as files and view those of other
musicians.

But what they cannot do, is
cooperate with each other.
And isn't it with cooperation,
that the greatest strengths of
the internet come to bear?

So we want to allow our users
to not just share musical notes,
but also comment on each others
notes and discuss them.

## What do you need to read to understand this chapter?

It is not expected that
you have read all of this Field Manual
to understand this chapter.

But you should have read these documents before
reading this chapter:

1. [The Tutorial](../01_Tutorial/00_Introduction.md)
2. [ipfs-log](../03_The_Architecture_of_OrbitDB/02_ipfs-log.md)

You may not need to understand entirely what
the `ipfs-log` is, but you should know that
it exists and that it is the basis of all OrbitDB Stores.

**Next: [What are Stores, AccessControllers and Indicies.](./01_Definitions.md)**
