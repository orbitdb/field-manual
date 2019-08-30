## OrbitDB Replication

> OrbitDB replication is something that happens automatically, under the hood. Understanding how to use it is one thing, but many times you'll want a deeper understanding of what happens, step-by-step when a database is created and data is transferred between peers.

<div>
  <h3>Table of Contents</h3>

- [Replication, step-by-step](#replication-step-by-step)
- [On "Sharding"](#on-sharding)

</div>

### Replication, step-by-step

#### Store Creation

1. The replicator is created along with the store

### The `heads` Exchange

1. A peer connects to you via the same orbit-db address
2. Exchange-heads is called

Exchange heads is a function that takes the following arguments:

```JavaScript
ipfs // IPFS instance to work with
address // The pubsub address
peer // the IPFS peer that you're interfacing with
getStore // returns the `orbit-db-store` object at the address from the orbit-db.stores hashmap
getDirectConnection // gets direct connection to peer `pubsub-1on1` object?
onMessage // copy of `orbit-db._onMessage`
onChannelCreated // Adds channel to `this._directConnection`
```

The function:
* Checks for an existing channel
* If one does not exist, it creates an `ipfs-pubsub-1on1` channel between your peer and the other
* Assigns the `_handleMessage` function to the pubsub channel
* adds the channel to `orbit-db._directConnections`
* Gets the latest heads of the db
* Sends them on the 1 to 1 channel

The other peer does the same since `_onPeerConnected` is called with them too

Then, each peer calls `orbit-db-store.sync`


#### The `sync` function

This function saves the heads to IPFS via a hash and then calls replicator load



#### The Replicator Class

The Replicator class extends from the [EventEmitter](https://nodejs.org/api/events.html#events_class_eventemitter) node.js built-in package

3. The replicators events are definied
4. orbit-db-store.sync is called (from loadSnapshot, orbit-db._onMessage)
5. orbit-db-store.loadMoreFrom is called?
6. orbit-db-store.saveSnapshot is called?
7. The replicator is stopped when the store is closed

```JavaScript
// Events

// Properties
    this._store = store // `orbit-db-store` instance
    this._fetching = {} // `hashmap to track objects you're currently fetching
    this._stats = { // struct-like situation to keep track of replication status
      tasksRequested: 0,
      tasksStarted: 0,
      tasksProcessed: 0
    }
    this._buffer = [] // array of entries or hashes that it needs to fetch

    this._concurrency = concurrency || 128 // arbitrary value for number of concurrent operations
    this._queue = {} // queue of entries or hashes that are "in line"
    this._q = new Set() // unused?

    // Flush the queue as an emergency switch
    this._flushTimer = setInterval(() => {
      if (this.tasksRunning === 0 && Object.keys(this._queue).length > 0) {
        logger.warn('Had to flush the queue!', Object.keys(this._queue).length, 'items in the queue, ', this.tasksRequested, this.tasksFinished, ' tasks requested/finished')
        setTimeout(() => this._processQueue(), 0)
      }
    }, 3000)

// Getters
getter tasksRequests
getter tasksStarted
getter tasksRunning
getter tasksQueued
getter tasksFinished

// Methods
getQueue

load

stop

// "Private" Methods
_addToQueue
async _processQueue
async _processOne
```


### On "Sharding"

There have been questions about how sharding is handled in such a peer-to-peer database system.
