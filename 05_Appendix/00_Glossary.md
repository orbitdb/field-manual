# Appendix I: Glossary

We use a lot of new terms in this tutorial that you may not have run across. In order to make it easier to look up what these terms are, we've added this short glossary. It also helps us to formalize what spelling or definitions we're going with - 'datastore' over 'data store', isomorphic meaning platform agnostic as opposed to just frontend vs backend, etc.

A small note: We don't have entries for abbreviations, such as IPFS for Interplanetary File System. Use your native search function to find the relevant entries.

## Terms to use

* **Conflict-free Replicated Data types (CRDTs)**: In distributed computing, a conflict-free replicated data type (CRDT) is a data structure which can be replicated across multiple computers in a network, where the replicas can be updated independently and concurrently without coordination between the replicas, and where it is always mathematically possible to resolve inconsistencies which might result. [Wikipedia](https://en.wikipedia.org/wiki/Conflict-free_replicated_data_type)
* **database**:
* **datastore**:
* **eventual consistency**:  Operations can be taking place at places and times that you are unaware of, with the assumption that you'll eventually connect with peers, share your logs, and sync your data. This contrasts with Blockchain's idea of _strong consistency_ where entries are added to the database only after they have been verified by some distributed consensus algorithm.
* **Filecoin**:
* **InterPlanetary File System (IPFS)**:
* **isomorphic**:
* **js-ipfs**: The JavaScript implementation of IPFS. [GitHub](https://github.com/ipfs/js-ipfs).
* **packet switching**: Packet switching is a method of grouping data that is transmitted over a digital network into packets. Packets are made of a header and a payload. Data in the header are used by networking hardware to direct the packet to its destination where the payload is extracted and used by application software. Packet switching is the primary basis for data communications in computer networks worldwide. [Wikipedia](https://en.wikipedia.org/wiki/Packet_switching).
* **Paxos**: Paxos is a family of protocols for solving consensus in a network of unreliable processors (that is, processors that may fail). Consensus is the process of agreeing on one result among a group of participants. This problem becomes difficult when the participants or their communication medium may experience failures. [Wikipedia](https://en.wikipedia.org/wiki/Paxos_(computer_science)).
* **strong consistency**: In this structural process, entries are added to a database only after they have been verified by some distributed consensus algorithm.
