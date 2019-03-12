## OrbitDB Replication

> OrbitDB replication is something that happens automatically, under the hood. Understanding how to use it is one thing, but many times you'll want a deeper understanding of what happens, step-by-step when a database is created and data is transferred betwen peers.

<div>
  <h3>Table of Contents</h3>

- [Replication, step-by-step](#replication-step-by-step)
- [On "Sharding"](#on-sharding)

</div>

### Replication, step-by-step

In the tutorial, you learned how to enable debug logging and were able to see the steps of replication take place in your console output. Here, you will be able to dissect these logs and learn how OrbitDB shares data between peers reliably by sharing a minimal amount of data to start.

To review,

### On "Sharding"

There have been questions about how sharding is handled in such a peer-to-peer database system.
