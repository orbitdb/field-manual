## The `ipfs-log` package

### Basic `ipfs-log` commands

### Dissecting a log entry

ipfs-log
In [1]:
const Log = require("../src/log") // const Log = require("ipfs-log") elsewhere
Intro
The Log provided by the ipfs-log package is an implementation of a Conflict-Free Replicated Data Type (CRDT) that utilizes the Interplanetary File System (IPFS) as a storage backend. The functionality in this package forms the backbone of orbit-db.

Table of Contents
Top
Intro
Nomenclature and Concepts
Prerequisites
IPFS Node
Access Controller
Identity
Usage
Creating Logs
Manipulating Logs
Joining Logs
API Documentation
Log
Nomenclature and Concepts
Conflict-Free Replicated Data Type (CRDT)
A Conflict-Free Replicated Data Type is a type of log that solves the problem of locally storing, and ultimately merging, distrubuted data sets to other distributed data sets1. It allows users to perform operations on local databases with the intent of merging or joining those data with the data stored on the devices of other peers in the network.

Lamport Clock
To achieve successful merging - merging that is properly associative - entries are timestamped with something called a Lamport Clock2. The timestamp of each entry is a pair of values: a logical clock counter of the entry (as opposed to wall clock), and an identifier of the user or device that generated the entry.

In the case of ipfs-log, the identifier is the public key of the IPFS node where the entries are initially generated.

// Lamport Clock Object
{
  id: '042750228c5d81653e5142e6a56d55...e5216b9a6612dbfc56e906bdbf34ea373c92b30d7',
  time: 0
}
Heads and Tails
Heads and Tails are important concepts in terms of CRDTs, and many people require a bit of explanation before fully understanding the concept and its implications.

Heads
The head of a log is an entry that is not referenced by any other entry. Practically speaking, these are the latest entries being appended to a log or logs.

This is best understood by example, observing how the heads change over time. In the following examples, circles are entries, green circles are heads, and arrows denote the pointers contained in the entry, to the previous record.

Let's start with the simplest example - a single user writing entries to a single log.

Single Node CRDT over time, Simplest Example

However, we are not in the business of single-device / single-user logs, so let's imagine the following scenario in an attempt to find the least-complex, but still complete example of how the heads would work over time.

First, in plain words and some pseudocode:

User 1 starts a Log (log1 = new Log)
User 2 starts a Log (log2 = new Log)
User 1 adds two entries to the log (log1.append)
User 2 merges that log with their own (log2.join(log1))
User 1 adds two more entries (log1.append)
User 2 adds an entry (log2.append)
User 2 merges the log again (log2.join)
User 2 adds one more entry (log2.append)
Now in a diagram:

Multiple Node CRDT over time, Least-Complex Example

We can then see how it's possible that a CRDT may have more than one head entry (maybe hundreds) and how those entries change over time with multiple users.

Tails
A CRDT of any size can be stored in IPFS. However, When performing computations on the data, it needs to be loaded into an "input array" (i.e. subset of the log) that exists in a finite memory space. The tails of such a log point to entries that are not in the input array.

For our example, let's imagine a log with hundreds of millions of entries. You don't have access to a supercomputing center so tt's not feasible to load the log into memory. Thus, we use a partial traversal of the log, the tails of which contain the pointers to the next records to be traversed, if we so choose.

This concept is visualized below, with the dim entries signifying non-traversed, and the orange entries signifying tails.

Tails Example

G-Set
ipfs-log specifically uses a G-Set CRDT, which in practice means append-only with no deletetion.

class GSet {
  constuctor (values) {}
  append (value) {}
  merge (set) {}
  get (value) {}
  has (value) {}
  get values () {}
  get length () {}
}
References
https://citemaster.net/get/10b50274-7bc5-11e5-8aa1-00163e009cc7/p558-lamport.pdf
https://hal.inria.fr/inria-00555588
Prerequisites
For a minimum viable ipfs-log, you need three things: a running IPFS node, an access controller, and an identity.

IPFS Node
For our examples, we'll switch between a node.js js-ipfs instance, and a go node using js-ipfs-api.

In [2]:
const IPFS = require("ipfs")
const IpfsApi = require("ipfs-api")
In [3]:
// Default config
var ipfs = new IPFS()
var ipfsapi = new IpfsApi("localhost", 5001)
^ Always a good sign.

Access Controller
TODO: Details

In [4]:
const AccessController = require('../src/default-access-controller')
In [5]:
var testACL = new AccessController()
Identity
TODO: Details

In [6]:
const IdentityProvider = require('orbit-db-identity-provider')
const Keystore = require('orbit-db-keystore')
Error: Lock FcntlFlock of /home/jovyan/.jsipfs/repo.lock failed: EAGAIN, Resource temporarily unavailable
    at fs.close (/home/jovyan/orbitdb/ipfs-log/node_modules/lock-me/src/unix.js:20:14)
    at /home/jovyan/orbitdb/ipfs-log/node_modules/graceful-fs/graceful-fs.js:43:10
    at FSReqWrap.oncomplete (fs.js:139:20)
In [7]:
const keystore = Keystore.create("./test/fixtures/keys")
const identitySignerFn = async (id, data) => {
    const key = await keystore.getKey(id)
    return keystore.sign(key, data)
}

let testIdentityA, testIdentityB;
(async () => { 
    testIdentityA = await IdentityProvider.createIdentity(keystore, 'userA', identitySignerFn)
    testIdentityB = await IdentityProvider.createIdentity(keystore, 'userB', identitySignerFn)
    testIdentityC = await IdentityProvider.createIdentity(keystore, 'userC', identitySignerFn)
})()
Usage
With the following, we can create a minimum viable log:

a working IPFS node
access controller
an identity
The full signature is

new Log(ipfs, access, identity, [logId], [entries], [heads], [clock])
We'll more into the optional params now. For now, let's create a couple "minimum viable" logs.

Creating Logs
In [8]:
var log = new Log(ipfs, testACL, testIdentityA)   
var log2 = new Log(ipfsapi, testACL, testIdentityB)
If you don't supply a logId, the current javascript timestamp will be used.

In [9]:
log.id
Out[9]:
'1542333975730'
If no log entries are specified, the log's length will be 0.

In [10]:
log2.length
Out[10]:
0
ipfs-log uses Lamport Clocks, which are a type of vector clock. By tracking both the ID and timestamp of each entry, logs can be merged with other logs and still produce a unique, sorted, set of entries to be processed. This data type is compatible with any "pure" function.

In [11]:
log.clock
Out[11]:
LamportClock {
  id:
   '04c5801bce297e36415cdc2c0d89a9e95435882a82ebbf62541a2ba22f8f0db59e11512051b56cb4a35faa7f5481e8abd0272092dd9049dd6674b5b5ac86211126',
  time: 0 }
In [12]:
log2.clock
Out[12]:
LamportClock {
  id:
   '0427b450702fffa95e2715b3ab75c99df33377d8c463ce014878271ec802019a465ecf3fe39d255bbb49906413ebe1d863f16aa41799fb8464a9949728f8d95e35',
  time: 0 }
Manipulating Logs
Now that we have our logs, let's create some entries!

TODO: Entry Signature

In [13]:
const Entry = require("./src/entry")
const Clock = require('./src/lamport-clock')
internal/modules/cjs/loader.js:583
    throw err;
    ^

Error: Cannot find module './src/entry'
    at Function.Module._resolveFilename (internal/modules/cjs/loader.js:581:15)
    at Function.Module._load (internal/modules/cjs/loader.js:507:25)
    at Module.require (internal/modules/cjs/loader.js:637:17)
    at require (internal/modules/cjs/helpers.js:20:18)
    at evalmachine.<anonymous>:1:15
    at Script.runInThisContext (vm.js:91:20)
    at Object.runInThisContext (vm.js:298:38)
    at run ([eval]:1002:15)
    at onRunRequest ([eval]:829:18)
    at onMessage ([eval]:789:13)
Adding entries at log creation
By utilizng the first of our optional params, we can create a log with entries right from the start. Observe how the length and clock values change. Please note that with this method you have to manually set the clock values for each entry.

In [14]:
let log3;

(async() => {
    var entry1 = await Entry.create(ipfs, testIdentityC, 'C', 'entry1', [], new Clock('C', 0))
    var entry2 = await Entry.create(ipfs, testIdentityC, 'C', 'entry2', [], new Clock('C', 1))
    log3 = new Log(ipfs, testACL, testIdentityC, null, [entry1, entry2])
})()
ReferenceError: Entry is not defined
    at evalmachine.<anonymous>:4:18
    at evalmachine.<anonymous>:7:3
    at Script.runInThisContext (vm.js:91:20)
    at Object.runInThisContext (vm.js:298:38)
    at run ([eval]:1002:15)
    at onRunRequest ([eval]:829:18)
    at onMessage ([eval]:789:13)
    at process.emit (events.js:182:13)
    at emit (internal/child_process.js:812:12)
    at process._tickCallback (internal/process/next_tick.js:63:19)
In [15]:
log3.length
evalmachine.<anonymous>:1
log3.length
     ^

TypeError: Cannot read property 'length' of undefined
    at evalmachine.<anonymous>:1:6
    at Script.runInThisContext (vm.js:91:20)
    at Object.runInThisContext (vm.js:298:38)
    at run ([eval]:1002:15)
    at onRunRequest ([eval]:829:18)
    at onMessage ([eval]:789:13)
    at process.emit (events.js:182:13)
    at emit (internal/child_process.js:812:12)
    at process._tickCallback (internal/process/next_tick.js:63:19)
In [16]:
log3.clock
evalmachine.<anonymous>:1
log3.clock
     ^

TypeError: Cannot read property 'clock' of undefined
    at evalmachine.<anonymous>:1:6
    at Script.runInThisContext (vm.js:91:20)
    at Object.runInThisContext (vm.js:298:38)
    at run ([eval]:1002:15)
    at onRunRequest ([eval]:829:18)
    at onMessage ([eval]:789:13)
    at process.emit (events.js:182:13)
    at emit (internal/child_process.js:812:12)
    at process._tickCallback (internal/process/next_tick.js:63:19)
Adding entries after log creation
Note that the clock in the entries will be ignored and are therefor not necessary for this method.

In [17]:
(async () => {
    var entry3 = await Entry.create(ipfs, testIdentityC, 'C', 'entry3', [])
    var entry4 = await Entry.create(ipfs, testIdentityC, 'C', 'entry4', [])
    var entry5 = await Entry.create(ipfs, testIdentityC, 'C', 'entry5', [])
    log3.append(entry3)
    log3.append(entry4)
    log3.append(entry5)
})()
ReferenceError: Entry is not defined
    at evalmachine.<anonymous>:2:18
    at evalmachine.<anonymous>:8:3
    at Script.runInThisContext (vm.js:91:20)
    at Object.runInThisContext (vm.js:298:38)
    at run ([eval]:1002:15)
    at onRunRequest ([eval]:829:18)
    at onMessage ([eval]:789:13)
    at process.emit (events.js:182:13)
    at emit (internal/child_process.js:812:12)
    at process._tickCallback (internal/process/next_tick.js:63:19)
In [18]:
log3.length
evalmachine.<anonymous>:1
log3.length
     ^

TypeError: Cannot read property 'length' of undefined
    at evalmachine.<anonymous>:1:6
    at Script.runInThisContext (vm.js:91:20)
    at Object.runInThisContext (vm.js:298:38)
    at run ([eval]:1002:15)
    at onRunRequest ([eval]:829:18)
    at onMessage ([eval]:789:13)
    at process.emit (events.js:182:13)
    at emit (internal/child_process.js:812:12)
    at process._tickCallback (internal/process/next_tick.js:63:19)
In [19]:
log3.clock
evalmachine.<anonymous>:1
log3.clock
     ^

TypeError: Cannot read property 'clock' of undefined
    at evalmachine.<anonymous>:1:6
    at Script.runInThisContext (vm.js:91:20)
    at Object.runInThisContext (vm.js:298:38)
    at run ([eval]:1002:15)
    at onRunRequest ([eval]:829:18)
    at onMessage ([eval]:789:13)
    at process.emit (events.js:182:13)
    at emit (internal/child_process.js:812:12)
    at process._tickCallback (internal/process/next_tick.js:63:19)
Joining Logs
TODO: Show the magic
