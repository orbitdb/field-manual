# Moderating your Comment Threads.

We have now gotten a store that
you can publish notes and comments with.

But you cannot actually
control who and what
gets to comment and count as a valid comment.

In other words: How can you moderate
a Peer-to-Peer Database?

Well, you can't really.
Or at least, you cannot
moderate data on another
persons computer.

I cannot delete a file on
your computer, anymore
than you can delete a file
on mine.

If either of us could do that,
we would consider that malware.

And this is not a Tutorial
on writing malware, so we'll not
go into it.

Moderating is generally considered
to be two separate tasks:

1. Restricting the writing to a database
2. Restricting the reading from a database and sharing of contents.

In a decentralized network, sharing data
is easy. Once any peer has some data, they
can share it essentially until their
bandwidth runs out.

But writing control is more complex.
We cannot prevent somebody from
writing to their own local
database, but we can decide,
whether we will accept the
local changes from another
peer in our own database.

And there OrbitDB `AccessController`s
come into action.

They are invoked when an OrbitDB
instance receives new entries for a specific
database and they determine, whether
the OrbitDB Instance should accept and
use these entries or deny and trash them.

Remember: These rules, that you write into
the AccessController can be changed or ignored
by other peers, if they so wish.
But then again, consider whether it's important to you what other
peers do with their own database, as long
as your database is clean and conforming to
all the rules you laid out?

Additionally, if most peers follow
your rules, then most content that violates
these rules will not persist anyway,
because nobody is around to pin it.
Although in some cases for some specific
data, somebody might be really insistent
and pin it anyway.

**Next: [Implementing a custom AccessController](06_Implementing_a_custom_AccessController.md)**
