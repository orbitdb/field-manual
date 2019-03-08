## Peer-to-Peer vs Client-Server

> The Internet's most ubiquitous model of content delivery requires that users run clients that connect to centralized servers. Peer-to-Peer a contrasting approach, and this chapter transitions client-server thinking to peer-to-peer, concept by concept. In short, you should favor _swarms over servers_, _peers over clients_, _encryption vs authorization_.

<div>
  <h3>Table of Contents</h3>
  
- [Peers vs Clients](#peers-vs-clients)
- [Swarms vs Servers](#swarms-vs-servers)
- [Encryption vs Authorization](#encryption-vs-authorization)

</div>

### Peers vs Clients

If there are no servers, then it would follow that there are no clients.

### Swarms vs Servers

In your thinking, first replace the idea of the _server_ with the idea of a **swarm**. in your mind.

In the traditional model, users run _clients_ that would connect to a _server_ which would store their data.

TODO: Client-server image

In the peer-to-peer modeal, users start out alone and unconnected with their data only stored locally, but very quickly connect to other peers in the same network in a relatively indiscriminate fashion. There is no real "center" of such a network, and thus it forms a "swarm" of connected peers.

TODO: Swarm image

This approach has obvious pros and cons:

- **Pro:** By default, applications will work offline and keep your data safe and local. 
- **Con:** The peers in the network are "untrusted" and will be able to request your data if they know the content address
- **Pro:** The network will be robust and self-healing
- **Con:** If an offline peer that has data you need, you may not be able to access it unless it's replicated elsewhere

In general, these cons will be mitigated by using encryption.

#### On "Serverless"

It's often claimed, and rightly so, that the popular term "serverless" is at best a misnomer, and at worst completely disingenuous. This term was coined to popularize the idea of writing code that can then be run, at a cost, on a "Function-as-a-Service" platform that all of the major cloud providers 

Peer-to-peer architectures _can be_ the true "serverless." It is possible, today, to create applications that share user data in a peer-to-peer fashion, avoiding middlemen and third parties, and relying on the surplus computational power. The reason the previous sentence is qualified is because there are some major challenges we will all be facing together in our distributed future:

1. Data Persistence
2. Payment Gateways
3. API Relaying

### Encryption vs Authorization

TODO
