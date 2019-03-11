## Peer-to-Peer vs Client-Server

> The Internet's most ubiquitous model of content delivery requires that users run clients that connect to centralized servers. Peer-to-peer a drastically contrasting approach, and this chapter transitions client-server thinking to peer-to-peer, favoring _swarms over servers_, _peers over clients_, _encryption over authorization_, and _pubsub messaging over API calls_.

<div>
  <h3>Table of Contents</h3>

- [Client-server architecture: a review](#client-server-architecture-a-review)
- [Peers vs Clients](#peers-vs-clients)
- [Swarms vs Servers](#swarms-vs-servers)
- [Encryption vs Authorization](#encryption-vs-authorization)
- [Pubsub vs API Calls](#pubsub-vs-api-calls)

</div>

### Client-server architecture: a review

In the traditional model, users run _clients_ that connect to a _servers_, which store and manage their data. Using the easiest example, users can run multiple Facebook clients - the website, mobile apps, SMS interfaces - that then make requests to Facebook servers, which queries and updates their data.

![Client-server Model](https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Server-based-network.svg/991px-Server-based-network.svg.png)

Over recent years, this method has been proven problematic in terms of data management, data ownership, and data security. These three together can be singularly referred to as _data sovereignty_, meaning the user who generated the data has control over who the data are sent to, what the data are used for, and how.

Now, component by component, you can unlearn the traditional way of thinking, and learn how to conceptualize how a peer-to-peer system might be architected and how it might behave.

### Swarms vs Servers

The first notion you should try to dismiss is that of the server, as they are no longer necessary to run peer-to-peer applications. Yes, applications like IPFS nodes run on servers, but it is designed to run in browsers or on regular desktop computers as well. 

In the peer-to-peer model, users start out alone and unconnected with their data only stored locally, but very quickly connect to other peers in the same network in a relatively indiscriminate fashion. There is no real "center" of such a network, and thus it forms a **swarm** of connected peers.

![Peer to peer swarm](https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/P2P-network.svg/991px-P2P-network.svg.png)

This approach has obvious pros and cons:

- **Pro:** By default, applications will work offline and keep your data local and safe. 
- **Con:** The peers in the network are "untrusted" and will be able to request your data if they know the content address
- **Pro:** The network will be robust and self-healing
- **Con:** If an offline peer that has data you need, you may not be able to access it unless it's replicated elsewhere
- **Pro:** If there _is_ a data breach, the so-called blast radius will be contained since it will only affect singular or small groups of devices, not necessarily affecting every user of the application.
- **Con:** There will be new, as-of-yet unimagined, vectors of attack to deceive and compromise data in these networks.

#### On "Serverless"

It's often claimed, and rightly so, that the popular term "serverless" is at best a misnomer, and at worst completely disingenuous. This term was coined to popularize the idea of writing code that can then be run, at a cost, on a "Function-as-a-Service" platform that all of the major cloud providers run. However, the common criticism is that this is just "somebody else's server," and it's true.

Peer-to-peer architectures _can be_ the true "serverless." It is possible, today, to create applications that share user data in a peer-to-peer fashion, avoiding middlemen and third parties, and relying on the surplus computational power. The reason the previous sentence is qualified is because there are some major challenges we will all be facing together in our distributed future:

1. Data Persistence
2. Payment Gateways
3. API Relaying

For now, you're going to see a lot more applications that run on `localhost` by default, that connect to other instances of the application running locally on other computers. There are currently traditional clients that already do this: Gitter, Slack, Discord, to name a few. These desktop apps run locally, but still connect to a server.

Therefore, they are not true _peers._

### Peers vs Clients

If there are no servers, then it would follow that there are no clients. In the traditional model, the functionality of an application is split up between it's server and its client. Perhaps you've heard the terms _thin client, _business layer_, _front-end_, _back-end_. They all mean specific things but all hint at a core feature of client server - that there is some functionality that a user has access to, and some functionality they don't.

The concept of a **peer** dismisses this notion, and when users run peer-to-peer applications, they are running the entire application code of the entire system locally. This is true of any true peer-to-peer application you are used to: Bittorrent, a Bitcoin wallet, even a program from previous generations like Kazaa. When you run any of those, you're running the system on your computer, and that's that. No additional code is required.

While, functionality of the peer is the same across all instances of the application, the true power of a peer-to-peer system comes from its connection to, and interaction with, other peers. A single bittorrent client is useless without other peers to connect to, just as Bitcoin wallet is useless without generating transactions and consensus with other peers and the underlying blockchain.

### Encryption vs Authorization

In a system where anybody can connect to anybody else, security becomes paramount. However, without a centralized server, traditional forms of security become impossible. If there are no central chokepoints to marshall data through, there is no place to authorize every user that wants access. Additionally, users often want as much privacy as possible - even demanding full anonymity (or at least pseudonymity) in many cases.

A prime solution to this problem of distributed security is the use of strong encryption: both to encrypt the data _at rest_, meaning when it is stored on any device, and _in transit_, meaning when it is being transmitted from one device to another over an internet connection.

- **Pro:** There are many types of encryption that are effectively impossible to crack via brute-force methods, meaning that it will take at least millions of years to guess the encryption key
- **Con:** If the encryption keys are lost and cannot be recovered, so too is the encrypted data.
- **Pro:** Systems that pass a large amount of encrypted data, particularly data encrypted via multiple different sets of keypairs, can create a large amount of "noise" making it very difficult for attackers to 
- **Con:** UX can be tricky, particularly for users new to the distributed space who don't have the same understanding of things like keys and encryption as the developers
- **Pro:** Any encryption key leaks will only affect data encrypted with those keys, not the entire data set of the system

One final trade-off to using keypair encryption as a form of application security is that it introduces the problems in key management, storage, and transfer. 

### Pubsub vs API Calls

As we move away from the traditional client-server model and towards a swarm of connected peers, we must think differently about the communication model. Traditionally, you would send messages via some sort of API - SOAP, REST, etc. The server would then process those requests, and disseminate information back out to the necessary clients.

But now, we have e peer-to-peer swarm where certain clients may not be connected at the time of messaging, and different types of messages need to be sent. Using the pubsub model - short for "publish and subscribe" - is one way of solving this issue. Peers will be able to subscribe to "topics" and other peers will be able to broadcast on those same topics.

Some examples:

1. One peer might want to query the database of all connected peers. They could do so by broadcasting on a "query" topic and then listening for messages broadcast back on a "result" topic.
2. One peer might be new to the swarm, and would want to announce themselves as online and available to interact with. They could broadcast on an "announce" topic, which would cause other peers to recognize them and connect
3. Pubsub can also be used as a rudimentary chat protocol, allowing peers to broadcast messages to each other via their Node IDs or some other uniquely identifying value.

The names of topics can be defined via unique IDs such as you did in the tutorial to minimize the amount of eavesdropping. These messages should be encrypted in transit, regardless.

The libp2p infrastructure in IPFS allows direct 1-on-1 peer communication by allowing peers to define their own protocols. This is an advanced topic, and is covered in detail in the next chapter: **[1-on-1 Peer Communication using custom protocols](#)**
