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

In the traditional model, users run _clients_ that connect to a _server_, (or servers) which store and manage their data. Using the easiest example, a service like Facebook offers multiple clients - a website, mobile apps, SMS interfaces, etc. - that then make requests to their server farm, which queries and updates their data.

<a title="Gnome-fs-client.svg: David Vignoni
Gnome-fs-server.svg: David Vignoni
derivative work: Calimo [LGPL (http://www.gnu.org/licenses/lgpl.html)], via Wikimedia Commons" href="https://commons.wikimedia.org/wiki/File:Client-server-model.svg"><img width="256" alt="Client-server-model" src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Client-server-model.svg/256px-Client-server-model.svg.png"></a>

Over recent years, this method has been proven problematic in terms of data management, data ownership, and data security. These three together can be singularly referred to as _data soveriegnity_, meaning the user who generated the data has control over who the data are sent to, what the data are used for, and how.

Now, component by component, you can unlearn the traditional way of thinking, and learn how to conceptualizate how a peer-to-peer system might be architected and how it might behave.

### Swarms vs Servers

The first notion you should try to dismiss is that of the server, as they are no longer necessary to run peer to peer applications. Yes, applications like IPFS nodes run on servers, but it is designed to run in browsers or on regular desktop computers as well. 

In the peer-to-peer modeal, users start out alone and unconnected with their data only stored locally, but very quickly connect to other peers in the same network in a relatively indiscriminate fashion. There is no real "center" of such a network, and thus it forms a **swarm** of connected peers.

TODO: Swarm image

This approach has obvious pros and cons:

- **Pro:** By default, applications will work offline and keep your data local and safe. 
- **Con:** The peers in the network are "untrusted" and will be able to request your data if they know the content address
- **Pro:** The network will be robust and self-healing
- **Con:** If an offline peer that has data you need, you may not be able to access it unless it's replicated elsewhere
- **Pro:** If there _is_ a data breach, the so-called blast radius will be contained since it will only affect singular or small groups of devices, not necessarily affecting every user of the application.

You're going to see a lot more applications that run on localhost by default, that connect to other instances of the application running locally on other computers.

#### On "Serverless"

It's often claimed, and rightly so, that the popular term "serverless" is at best a misnomer, and at worst completely disingenuous. This term was coined to popularize the idea of writing code that can then be run, at a cost, on a "Function-as-a-Service" platform that all of the major cloud providers 

Peer-to-peer architectures _can be_ the true "serverless." It is possible, today, to create applications that share user data in a peer-to-peer fashion, avoiding middlemen and third parties, and relying on the surplus computational power. The reason the previous sentence is qualified is because there are some major challenges we will all be facing together in our distributed future:

1. Data Persistence
2. Payment Gateways
3. API Relaying

### Peers vs Clients

If there are no servers, then it would follow that there are no clients.

### Encryption vs Authorization

TODO

### Pubsub vs API Calls

TODO
