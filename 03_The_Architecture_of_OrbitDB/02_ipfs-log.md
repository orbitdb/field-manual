## The `ipfs-log` package

> The funcionality provided by the `ipfs-log` package is an implementation of a _Conflict-Free Replicated Data Type_ (CRDT) that utilizes IPFS's built in _directed acyclic graph_ (DAG) functionality to link data in a specific way. The functionality in this package forms the backbone of orbit-db.

<div>
  <h3>Table of Contents</h3>

TODO

</div>


### Conflict-Free Replicated Data Type (CRDT)

In the [previous chapter] we discussed how we can use IPFS's _directted acyclic graph_ (DAG) functionality to create linked data structures. OrbitDB utilizes this by building logs wherein each entry is linked to the previous one. To share state reliably between users, and to prevent the system from being confused as to how to parse these logs deterministically, a specific type of data structure called a _Conflict-Free Replicated Data Type_, or CRDT is used.

A CRDT is a type of log that solves the problem of locally storing and ultimately merging distrubuted data sets to other distributed data sets<sup>1</sup>. CRDTs allows users to perform operations on local databases with the intent of merging or joining those data with the data stored on the devices of other peers in the network.

### Lamport Clocks

To achieve successful merging - merging that is properly associative and deterministic - entries are timestamped with something called a Lamport Clock<sup>2</sup>. The timestamp of each entry is a pair of values: a logical clock counter of the entry (as opposed to wall clock), and an identifier of the user or device that generated the entry.

In the case of ipfs-log, the identifier is the public key of the IPFS node where the entries are initially generated.

```json
// Lamport Clock Object
{
  "id": "042750228c5d81653e5142e6a56d55...e5216b9a6612dbfc56e906bdbf34ea373c92b30d7",
  "time": 0
}
```

> **Note:** The "time" field is a monotonically increasing integer that increments each time a new entry is added to the log. It is not "wall time", e.g. a unix timestamp.

### Heads and Tails

Heads and Tails are important concepts in terms of CRDTs, and many people require a bit of explanation before fully understanding the concept and its implications.

#### Heads

The head of a log is an entry that is not referenced by any other entry. Practically speaking, these are the latest entries being appended to a log or logs.

This is best understood by example, observing how the heads change over time. In the following examples, circles are entries, green circles are heads, and arrows denote the pointers contained in the entry, to the previous record.

Let's start with the simplest example - a single user writing entries to a single log.

![Single-Node CRDT over time, Simplest Example](../images/single-node-log-over-time.png)

However, we are not in the business of single-device / single-user logs, so let's imagine the following scenario in an attempt to find the least-complex, but still complete example of how the heads would work over time.

First, in plain words and some pseudocode:

1. User 1 starts a Log (log1 = new Log)
2. User 2 starts a Log (log2 = new Log)
3. User 1 adds two entries to the log (log1.append)
4. User 2 merges that log with their own (log2.join(log1))
5. User 1 adds two more entries (log1.append)
6. User 2 adds an entry (log2.append)
7. User 2 merges the log again (log2.join)
8. User 2 adds one more entry (log2.append)

Now in a diagram:

![Multiple Nodes Over Time](../images/multiple-nodes-log-over-time.png)

##### Multiple Node CRDT over time, Least-Complex Example

We can then see how it's possible that a CRDT may have more than one head entry (maybe hundreds) and how those entries change over time with multiple users.

#### Tails

A CRDT of any size can be stored in IPFS. However, When performing computations on the data, it needs to be loaded into an "input array" (i.e. subset of the log) that exists in a finite memory space. The tails of such a log point to entries that are not in the input array.

For our example, let's imagine a log with hundreds of millions of entries. You don't have access to a supercomputing center so tt's not feasible to load the log into memory. Thus, we use a partial traversal of the log, the tails of which contain the pointers to the next records to be traversed, if we so choose.

This concept is visualized below, with the dim entries signifying non-traversed, and the orange entries signifying tails.

![Tails Example](../images/multiple-nodes-log-over-time.png)

G-Set
ipfs-log specifically uses a G-Set CRDT, which in practice means append-only with no deletetion.

```JavaScript
class GSet {
  constuctor (values) {}
  append (value) {}
  merge (set) {}
  get (value) {}
  has (value) {}
  get values () {}
  get length () {}
}
```

You can learn more in the academic references here:
* https://citemaster.net/get/10b50274-7bc5-11e5-8aa1-00163e009cc7/p558-lamport.pdf
* https://hal.inria.fr/inria-00555588
