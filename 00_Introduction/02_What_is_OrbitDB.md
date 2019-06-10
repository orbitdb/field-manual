## What is OrbitDB?

OrbitDB is a database engine that is built on top of the _Interplanetary File System_, or _IPFS_.

You can consider _IPFS_ to be the distributed "hard drive" where all data are content-addressed and retrievable from a peer-to-peer swarm. It then follows that _[OrbitDB](https://github.com/orbitdb/orbit-db)_ is the distributed database that lives on that hard drive.

OrbitDB creates and manages mutable databases and provides an extremely simple interface, centered around the IPFS `get` and `set` functions. From these simply underpinnings, OrbitDB manages a great deal of complexity to store these databases, in a distributed fashion, on IPFS. OrbitDB achieves this by building structures called _Conflict-free Replicated Data Types_, or _CRDTs_. CRDTs are essentially logs with specifically-formatted "clock" values that allow multiple users to perform independent and asynchronous operations on the same distributed database. When the peers share these logs with each other, the clock values ensure that there is no ambiguity about how their disparate entries will be put back together.

Beyond that, what should you as the developer understand about OrbitDB?

### OrbitDB is written in JavaScript

OrbitDB is packaged as a Node.js library, available [here](https://github.com/orbitdb/orbit-db). JavaScript was chosen because of its popularity in the programming community, its ubiquity in web browsers, and its interoperability with the JavaScript implementation of IPFS, called [_js-ipfs_](https://github.com/ipfs/js-ipfs).

Work is currently underway to allow support for other programming languages via a common HTTP API.

### OrbitDB is NOT a Blockchain

OrbitDB operates on the model of _strong eventual consistency_ meaning that operations can be taking place at places and times that you are unaware of, with the assumption that you'll eventually connect with peers, share your logs, and sync your data. This contrasts with Blockchain's idea of _strong consistency_ where entries are added to the database only after they have been verified by some distributed consensus algorithm.

There is no built-in "double spend" protection in OrbitDB - that is on you, the developer, to implement.

### OrbitDB is free (as in freedom) software

OrbitDB is released under the MIT software license, which is an exceedingly permissible license. Organizations and individual developers are free to fork, embed, modify, and contribute to the code with no obligations from you, or from us. Of course, this also means there are no warranties as well.

### OrbitDB is a tool for you, the developer, to build distributed applications

Outside of a reference implementation called [Orbit Chat](https://github.com/orbitdb/orbit-web), the OrbitDB team primarily focuses on making OrbitDB more robust, reliable, and performant. Our mission is to enable you, the developer, to build distributed applications that will break into the mainstream and allow your users true sovereignty and control over their data.
