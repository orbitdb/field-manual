## The Interplanetary File System

> In order to understand how OrbitDB works, you need to understand a few things about how the Interplanetary File System (IPFS) works. IPFS is unique in a number of ways, but the TODO most relevant to you are how it assigns addresses to data, and 

<div>
  <h3>Table of Contents</h3>
  
- [Content-Addressed vs Location-Addressed](#content-addressed-vs-location-addressed)
- Y
- Z

</div>

### Content-Addressed vs Location-Addressed

Most content on the internet is _location-addressed_. You type in a familiar name, such as [https://github.com/orbitdb](https://github.com/orbitdb) and that request is sent to the Domain Name System (DNS), which queries, cross-references, and determines which servers out of the millions  out there are the ones with your data on it. Then, that server would understand how to process your query, and send the data back.

![Location-Addressed Illustration](../images/Location-Addressed.jpg)

In IPFS, your files are instead _content-addressed_. When you add content to IPFS, that content is given an address based on _what_ it is, freeing it from the constraints of its location. You simply ask for what you want, by its _hash_, and multiple servers can respond at the same time if they have the data.

![Content-Addressed Hashing](../images/Content-Addressed.jpg)

Content addressing is achieved by a technique called _hashing_, which is a very oblique way of saying "chops up your data into blocks, sum them together repeatedly, and reduce the filw down to a unique, consistently-sized alphanumeric string."  This is a process identical to generating a "checksum," if you're familiar with that.

For hashing algorithms, there are currently two standards in play: Content ID version 0 (CIDv0) and Content ID version 1 (CIDv1).

- CIDv0 hashes look like this: `QmWpvK4bYR7k9b1feM48fskt2XsZfMaPfNnFxdbhJHw7QJ`
- CIDv1 hashes look like this: `zdpuAmRtbL62Yt5w3H6rpm8PoMZFoQuqLgxoMsDJR5frJGxKJ`

> **Note:** These hashes are a special type called a [multihash](https://github.com/multiformats/multihash). In practice, this means they have self-describing prefixes. If you see something starting with `zdpu`, you know it's a CIDv1.

The two main reasons to switch to content addressing are _performance_ and _verifiability_. The performance boost comes from the fact that you can download files simultaneously from multiple peers, similar to Bittorrent. The hashes are also verifiable, meaning that you only download data you request. No other data can have that same hash. 

#### Example

Let's take a very famous file, and add it to IPFS.  Here's the plain-text MIT license:

```plain
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and
associated documentation files (the "Software"), to deal in the Software without restriction,
including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial
portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT
NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```

If you copy and paste that , newlines and all, into a file named `MIT` and then add that text to IPFS, it will return `QmWpvK4bYR7k9b1feM48fskt2XsZfMaPfNnFxdbhJHw7QJ` every time. That is now, and will be in the future, the _content address_ of that file.

### Directed Acyclic Graphs

This is a _graph_ of connected _nodes_.

![Simple Graph](../images/Simple-Graph.jpg)

This is a _directed graph_

![Directed Graph](../images/Directed-Graph.jpg)

This is an directed _acyclic_ graph.

As you can see, a directed acyclic graph, or DAG, is a graph of nodes, connected in a direction, that never circles back upon itself. That is, no nodes later in the graph point back to any previous nodes.

You can make the nodes "point" to each other, but perhaps the best way is to use their CIDs. You get the benefits of using CIDS in general: verifiability and performance, and nwo you have the added benefit of being able to _enforce_ the acyclic property of the graph - it is virtually impossible for any past nodes to predict the hashes of future nodes in order to reference backwards.

This technique of using cryptographic hashes to link data is named after [Ralph Merkle](https://scholar.google.com/scholar?hl=en&as_sdt=0%2C22&q=ralph+merkle&btnG=), so this data structure is called a Merkle DAG.

### Interplanetary Linked Data

Many popular pieces of software, notably Git and blockchain technologies that power cryptocurrencies like Bitcoin, rely on Merkle DAGS. IPFS does as well, using it to form the basis of a standard called Interplanetary Linked Data, or IPLD.
