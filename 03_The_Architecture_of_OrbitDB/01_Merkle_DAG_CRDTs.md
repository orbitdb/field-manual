## The Interplanetary File System

> In order to understand how OrbitDB works, you need to understand a few things about how the Interplanetary File System (IPFS) works. IPFS is unique in a number of ways, but the TODO most relevant to you are how it assigns addresses to data, and 

<div>
  <h3>Table of Contents</h3>
  
- [Content-Addressed vs Location-Addressed](#content-addressed-vs-location-addressed)
- Y
- Z

</div>

### Content-Addressed vs Location-Addressed

Most content on the internet is _location-addressed_. You type in a familiar name, such as [https://github.com/orbitdb](https://github.com/orbitdb) and that request is sent through a system that queries, cross-references, and retrieves that content based on _where_ that content is. That is, which servers out of the millions  out there are the ones with your data on it.

![Location-Addressed Illustration](../images/Location-Addressed.jpg)

In IPFS, your files are instead _content-addressed_. When you add content to IPFS, that content is given an address based on _what_ it is, freeing it from the constraints of its location.

Content addressing is based on a technique called _hashing_. This is a very oblique way of saying that it chops up your data into blocks, sums them together repeatedly, and reduces the filw down to a unique alphanumeric string called a _hash_. This is a process identical to a "checksum," if you're familiar with that.

TODO: Content-addressed illustration.

There are currently two standards in play, Content ID version 0 (CIDv0) and Content ID version 1 (CIDv1).

- CIDv0 hashes look like this: `QmWpvK4bYR7k9b1feM48fskt2XsZfMaPfNnFxdbhJHw7QJ`
- CIDv1 hashes look like this: `zdpuAmRtbL62Yt5w3H6rpm8PoMZFoQuqLgxoMsDJR5frJGxKJ`

> **Note:** These hashes are a special type called a [multihash](https://github.com/multiformats/multihash). In practice, this means they have self-describing prefixes. If you see something starting with `zdpu`, you know it's a CIDv1.

The two main reasons to switch to content addressing are _performance_ and _verifiability_.  of the main reasons for contend-addressing is performance - 

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

If you copy and paste that , newlines and all, into a file named `MIT` and then add that text to IPFS, it will return `QmWpvK4bYR7k9b1feM48fskt2XsZfMaPfNnFxdbhJHw7QJ` every time.

### Directed Acyclic Graphs, Merkle Style

This is a _graph_ of connected _nodes_.

TODO: Graph illustration

This is a _directed graph_

TODO: directed graph illustration

This is an directed _acyclic_ graph.

As you can see, a directed acyclic graph, or DAG, is a graph of nodes, connected in a direction, that never circles back upon itself. That is, no nodes later in the graph point back to any previous nodes.

You can make the nodes "point" to each other, but perhaps the best way is to use their CIDs. You get the benefits of using CIDS in general: verifiability and performance, and nwo you have the added benefit of being able to _enforce_ the acyclic property of the graph - it is virtually impossible for any past nodes to predict the hashes of future nodes in order to reference backwards.

This technique of using cryptographic hashes to link data is named after [Ralph Merkle](https://scholar.google.com/scholar?hl=en&as_sdt=0%2C22&q=ralph+merkle&btnG=), so this data structure is called a Merkle DAG.

### CRDTs
