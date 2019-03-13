## What is OrbitDB?

If _IPFS_ is the distributed "hard drive" where all data are content-addressed and retrievable from a peer-to-peer swearm, then _[OrbitDB](https://github.com/orbitdb/orbit-db)_ is the database engine. OrbitDB creates and manages mutable databases and provides an extremely simple interface, typically centered around simple `get` and `set` functions, to manage a large deal of complexity to store these databases in a distributed fashion on IPFS.

OrbitDB achieves this by building structures called _Conflict-free Replicated Data Types_, or CRDTs. CRDTs are essentially logs with specific "clock" values that allow multiple users to perform independent and asynchonous operations on the same database. When the peers share these logs with each other, the clock values ensure that there is no ambiguity about how their disparate entries will be put back together.

What does this mean in practical terms, and what should you as the developer understand about OrbitDB?

### OrbitDB is written in JavaScript

OrbitDB is packaged as a node.js library, available [here](https://github.com/orbitdb/orbit-db). JavaScript was chosen because of it's popularity and ubiquity in the programming community, and for its interpoerability with the JavaScript implementation of IPFS, called _js-ipfs_.

Work is currently underway to allow interoperability between multiple programming languages via a common HTTP API.

### OrbitDB is free (as in freedom) software

OrbitDB is released under the MIT software license, which is an exceedingly permissible license. Organizations and individual develoers are free to fork, embed, modify, and contribute the code with no obligations. Of course, this also means there are no warrantys as well.

### OrbitDB is a tool for you, the developer, to build distributed applications

Outside of an rereference implementation called [Orbit Chat](https://github.com/orbitdb/orbit-web), the OrbitDB team primiarily focuses on making OrbitDB more robust, reliable, and performant. Our mission is to enable you to build distributed applications that will break into the mainstream and allows your users true soverignty over their data. 
