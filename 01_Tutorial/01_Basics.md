## Chapter 1 - Laying the Foundation

> The basics of OrbitDB include installing OrbitDB (and IPFS), setting up an isomorphic project that runs in both Node.js and the browser, creating databases, and understanding how to choose datastores.
> 
> **Note for the authors of this tutorial:** IMHO a true beginner should focus on the core benefits of OrbitDB and IPFS. The isometric property is a nice to have but it might add another cognitive load. This tutorial would gain in ease of use by making 2 distinct sections for Node.js and for the browser.

> **Note for the authors of this tutorial:** Would you mind replacing the HTML tags here, `div` and `h3`, with Markdown tags?

<div>
  <h3>Table of Contents</h3>

Please see the [Introduction](./00_Introduction.md) before beginning this chapter.

- [Installing the requirements: IPFS and OrbitDB](#installing-the-requirements-ipfs-and-orbitdb)
- [Instantiating IPFS and OrbitDB](#instantiating-ipfs-and-orbitdb)
- [Creating a database](#creating-a-database)
- [Choosing a datastore](#choosing-a-data-store)
- [Key takeaways](#key-takeaways)

</div>

### Installing the requirements: IPFS and OrbitDB

Before you start working on the core functionality behind the peer-to-peer sharing of sheet music, you’ll need to get the foundations of our distributed database set up.

You will need to get the code for OrbitDB and its dependency, IPFS, and make it available to your project. The process is different between the browser and Node.js, so we cover both here.

> **Note**: Both OrbitDB and js-ipfs are open source, which give you the ability to build and even contribute to the code. This will be covered in detail in [Part 3](../03_The_Architecture_of_OrbitDB).

#### In Node.js

Create a project directory (for example `orbitdb-ch1`) and `cd` to there from your command line. Then run the following command:

```bash
$ npm init --yes
$ npm install orbit-db ipfs
```
If you want to use Git to track your progress, we also suggest typing the following command lines while in the folder:

```bash
$ git init
$ echo node_modules > .gitignore
```

The output will be
```bash
$ mkdir orbitdb-ch1
$ cd orbitdb-ch1
$ git init
   Initialized empty Git repository in /Users/myPath/orbitdb-ch1/.git/
$ echo node_modules > .gitignore
$ npm init --yes
   Wrote to /Users/myPath/orbitdb-ch1/package.json:
   ... some stuff...
$ npm install orbit-db ipfs
   ... a lot more stuff...
   + orbit-db@0.26.1
   + ipfs@0.55.4
   added 1165 packages from 1305 contributors and audited 1165 packages in 174.258s

```
This will create 2 files `package.json`, `package-lock.json`, and a `node_modules` folder.

> **Note:** If you're running on a Windows prompt, or if you don't have certain build tools like [`g++`](https://gcc.gnu.org) and [`python`](https://www.python.org) installed, you may see a noisy console output with lots of warnings and errors. Keep going, your code should still run.

> **Note:** Adding the `--yes` flag will automatically use your npm defaults. You can go through and edit the `package.json` later.

> **Note:** This code was tested on Node v12.14.8. Your mileage for other versions may vary.

#### In the Browser

If you're using the browser for this tutorial, we recommend using [unpkg](https://www.unpkg.com) for obtaining pre-built, minified versions of both IPFS and OrbitDB. Simply include these in your HTML:

```html
<script src="https://unpkg.com/ipfs@0.55.1/dist/index.min.js"></script>
<script src="https://unpkg.com/orbit-db@0.26.1/dist/orbitdb.min.js"></script>
```

You will now have global `Ipfs` and `OrbitDB` objects available to you. You will see how we'll use these later.

### Creating the isomorphic bookends

Since OrbitDB works in the browser and Node.js, you're going to want to make the library as _isomorphic_ as possible. This means we want the same code to run in the browser as it runs in REPL (Read-Eval-Print-Loop) or local environment. Luckily, you will have the luxury of using the same language, JavaScript, for both Node.js and browser environments.

In the folder, create a new file called `newpieceplease.js` and put this code in there:

```js
class NewPiecePlease {
  constructor (Ipfs, OrbitDB) {
    this.Ipfs = Ipfs
    this.OrbitDB = OrbitDB
  }
  // placeholder
}

try {
    const Ipfs = require('ipfs')
    const OrbitDB = require('orbit-db')

    module.exports = exports = new NewPiecePlease(Ipfs, OrbitDB)
} catch (e) {
    console.log(' -> caught an error:', err)
    var NPP = new NewPiecePlease(global.Ipfs, global.OrbitDB) // for nodeJS 
    // window.NPP = new NewPiecePlease(window.Ipfs, window.OrbitDB) // for browser
}
```

Or you may want to copy-paste the above code from the [tutorial repo in GitHub](https://github.com/orbitdb/field-manual/blob/a5459ac56402f620cab424c6c399f7c593e94f85/code_examples/01_01_newpieceplease.js), or retrieve from IPFS at `QmRZycUKy3MnRKRxkLu8jTzBEVHZovsYcbhdiwLQ221eBP` if you know IPFS and have the IPFS daemon installed locally. Beware that the IPFS version may be slightly different from the Github version.

In the browser, you can include this file in a script tag and have an `NPP` object at your disposal. 

In Node.js, you can simply call something like:

```js
$ node
> const NPP = require('./newpieceplease')
   undefined
```
Don't worry about the `undefined`. The evaluation loop of JavaScript displays it when your function doesn't return anything.

Not much should happen either way, since there's not much code there yet. For now you're just creating an instance `NPP` of the class `NewPiecePlease`.

#### What just happened?

Yyou have created a JavaScript class that can be invoked inside both environments Node.js and the browser. The class is called `NewPiecePlease`, with a constructor that takes two arguments

1. `Ipfs` for the constructor of  the `ipfs` package
2. `OrbitDB` for constructor of the `orbit-db` package

From here on out, we will ignore these isometric bookends and concentrate wholly on the `NewPiecePlease` class.

### Instantiating IPFS and OrbitDB
> **Note:** We have designed Chapters 1 and 2 of the tutorial to work offline, not requiring any internet connectivity or connections to peers.

OrbitDB requires a running IPFS node to operate, so you will create one here and notify OrbitDB about it. You'll create also an instance of OrbitDB in memory, ready to create databases and manage data.

In the place of the comment `// Placeholder` of the code above, add the following code:

```js
  async create() {
    this.node = await this.Ipfs.create({
      preload: { enabled: false },
      repo: './ipfs',
      EXPERIMENTAL: { pubsub: true },
      config: {
        Bootstrap: [],
        Addresses: { Swarm: [] }
      }
    })

    this._init()
  }

  async _init () {
    this.orbitdb = await this.OrbitDB.createInstance(this.node)
    this.defaultOptions = { accessController: {
      write: [this.orbitdb.identity.id]
      }
    console.log('OrbitDB owner id: ', this.orbitdb.identity.id)
    }
  }
```

The above code is part of the [tutorial repo in GitHub](../code_examples/01_Tutorial/02_Managing_Data).

Run this new code in `node` to check. For this doing, you need to reset the variable NPP in `node` and create a new instance of the updated class: exit from `node` with Control-D (^D) and relaunch `node`:

```js
$ node
   Welcome to Node.js v12.18.4.
   Type ".help" for more information.
> const NPP = require('./newpieceplease')
   undefined
> NPP.onready = () => {console.log(NPP.orbitdb.id)}
   [Function]
> NPP.create()
```
> **Note for the authors of this tutorial**: When I ran for the first time this code from a newly created folder `orbitdb-ch1`, the output is different from the subsequent runs. At first run, the output is not what is described in the tutorial. It seems to come from the `ipfs init` command line and is like this
> ```
> Promise { <pending> }
> > generating 2048-bit (rsa only) RSA keypair...
> to get started, enter:
> 	jsipfs cat /ipfs/QmfGBRT6BbWJd7yUc2uYdaUZJBbnEFvTqehPFoSMQ6wgdr/readme
> 
> ```

> If I exit `node` and run the sequence of commands again, the subsequent outputs are different and like what is described in the tutorial.
> ```
> Promise { <pending> }
> OrbitDB owner id:  03ecc23e7dfa8d1837ba979e719e934879c80dbd62fa0f42c84093f3ae53090e86
> ```

> I have no clue to explain, so I leave it to you.


When you type the command ```NPP.onready()```, in the output you will see something called a "multihash", like `QmfEUEbNaTLRgLEFg6641e2ZzwWTRoY3iguwiCaqzu9W21`. This is the identifier of your IPFS node. 
```js
> NPP.onready()
   QmfEUEbNaTLRgLEFg6641e2ZzwWTRoY3iguwiCaqzu9W21
   undefined
```
> **Note for the authors of this tutorial**: I didn't touch the side note below, but from a beginner's point of view, it adds cognitive noise and doesn't really help understanding the main topic. How about removing this comment and the possibility to retrieve from IPFS altogether? The average beginner is more comfortable with using Github.

You may have noticed that we referenced multihashes above for the code examples: these are the multihashes you can use to download the example code files, if GitHub is down and once you are familiar with IPFS. But at this stage you may not need this tutorial anymore :)

### What just happened?

In the function `async create`, the `await this.Ipfs.create` call creates a new IPFS node.

Meanings of the default settings:

- `preload: { enabled: false }` disables the use of so-called "pre-load" IPFS nodes. These nodes exist to help load balance
the global network and prevent DDoS. However, these nodes can go down and cause errors. Since we are only working offline
for now, we include this line to disable them.
- `repo: './ipfs'` designates the path of the repo in Node.js only. In the browser, you can actually remove this line. The
default setting is a folder called `.jsipfs` in your home directory. You will see why we choose this specific location for the
folder later.
- `EXPERIMENTAL: { pubsub: true }` enables [IPFS pubsub](https://blog.ipfs.io/25-pubsub/), which is a method of communicating between nodes and **is required for OrbitDB usage**, despite whether or not we are connected to other peers.
- `config: { Bootstrap: [], Addresses: { Swarm: [] }}` sets both our bootstrap peers list (peers that are loaded on
instantiation) and swarm peers list (peers that can connect and disconnect at any time to empty). We will populate these
later.

> **Note for the authors of this tutorial**: The 2 following settings do not exist in the sample code?

> - `node.on("error", (e) => { throw new Error(e) })` implements extremely basic error handling if something happens
during the creation of the IPFS node.
> - `node.on("ready", (e) => { orbitdb = new OrbitDB(node) })` instantiates OrbitDB on top of the IPFS node when it is ready.

By running the code above, you have created a new IPFS node that works locally and is not connected to any peers.
You have also loaded a new `orbitdb` object into memory, ready to create databases and manage data.

*You are now ready to use OrbitDB!*

### What else happened in Node.js?

When you ran the code in Node.js, you created two folders in your project folder (here we named it `orbitdb-ch1`): `'orbitdb/` and `ipfs/`. 

Type the `ls` command from the console:

```bash
$ ls orbitdb/
   QmfEUEbNaTLRgLEFg6641e2ZzwWTRoY3iguwiCaqzu9W21

$ ls ipfs/
   blocks		datastore	    keys		repo.lock
   config		datastore_spec	pins		version
```

Looking inside the `orbitdb/` folder you will see that the subfolder has the same ID as orbitdb, as well as the IPFS node. This is purposeful, as this initial folder contains metadata that OrbitDB needs to operate. See Part 3 for detailed information about this.

The `ipfs/` folder contains all of your IPFS data. Explaining this in depth is outside of the scope of this tutorial, but  the curious can [find out more here](https://ipfs.io).

### What else happened in the browser?

In the browser IPFS content is handled inside of `IndexedDB`, a persistent storage mechanism for browsers

![An image showing the IPFS IndexedDB databases in Firefox](../images/ipfs_browser.png)

**Note:** Since you have not explicitly defined a database in the browser, no `IndexedDB` databases have been created for OrbitDB yet.

> **Caution!** iOS and Android have been known to purge `IndexedDB` if storage space needs to be created inside of your phone.
If you use the browser, we recommend creating robust backup mechanisms at the application layer.

### Creating a database

Your users will want to create a catalog of musical pieces to practice. You will now create this database, and ensure that *only that user* can write to it.

Expand of your `_init` function to the following:

```diff
  async _init () {
    this.orbitdb = await OrbitDB.createInstance(node)
    this.defaultOptions = { accessController: { write: [this.orbitdb.identity.id] }}
+
+   const docStoreOptions = {
+     ...this.defaultOptions,
+     indexBy: 'hash',
+   }
+   this.pieces = await this.orbitdb.docstore('pieces', docStoreOptions)
  }
```

For check the new version of the class, do the same as above: exit from `node` with Control-D (^D) and relaunch `node`:

```js
$ node
   Welcome to Node.js v12.18.4.
   Type ".help" for more information.
> const NPP = require('./newpieceplease')
   undefined
> NPP.onready = () => {console.log(NPP.pieces.id)}
   [Function]
> NPP.create()
   Promise { <pending> }
   > IPFS node's id:  03ecc23e7dfa8d1837ba979e719e934879c80dbd62fa0f42c84093f3ae53090e86
> NPP.onready()
   /orbitdb/zdpuAxtiGj9xZaXCJx1z5852ZUYWJ8TjHeKBpMruUs7nNS8CC/pieces
   undefined
```

The output: `/orbitdb/zdpuAxtiGj9xZaXCJx1z5852ZUYWJ8TjHeKBpMruUs7nNS8CC/pieces` is the id, or **address** (technically a multiaddress) of this database. It is important for you to not only _know_ this, but also to understand what it is. This string is composed of 3 parts, separated by `/`s:

1. The first bit, `/orbitdb.`, is the protocol. It tells you that this address is an OrbitDB address.
2. The second, or middle, part `zdpuB3VvBJHqYCocN4utQrpBseHou88mq2DLh7bUkWviBQSE3` that is the most interesting. This is the Content ID (CID) of the database manifest, which contains:
    - The **access control list** of the database
    - The **type** of the database
    - The **name** of the database
3. The final part is the name you provided, in this case `pieces`, which becomes the final part of the multiaddress

Learn more about multiaddress and manifest in the [OrbitDB Guide](https://github.com/orbitdb/orbit-db/blob/main/GUIDE.md#address)

#### What just happened?

Your code created a local OrbitDB database, of type `docstore`, writable only by the user who created it. Here it is the OrbitDB instance --on top of an IPFS node that has the correct id, which we assume is controlled by you-- that created it.

- `defaultOptions` and `docStoreOptions` define the parameters for the database we are about to create.
  - `accessController: { write: [orbitdb.identity.id] }` defines the ACL, or "Access Control List". In this instance
  we are restricting `write` access to ONLY the OrbitDB instances identified by our particular `id`
  - `indexBy: "hash"` is a `docstore`-specific option, which specifies the field by which our database is indexed
- `pieces = await orbitdb.docstore('pieces', options)` is the API call that creates the database. Once this instruction is
executed, the database is open and can be acted upon.

> **Caution!** A note about identity: Your public key is not your identity. We repeat, *your public key is not your identity*.  That being said, it is often used as such for convenience's sake, and the lack of better alternatives. So, in the early parts of this  tutorial we say "writable only to you" when we really mean "writable only by an OrbitDB instance on top of an IPFS node that has the correct id, which we are assuming is controlled by you."

### What else happened in Node.js?

You will see some activity inside your project's `orbitdb/` folder. Type the `ls` command from the console:
> **Note to the authors:** Are you sure that these informations haven't moved elsewhere? in `orbitdb/`? I see nothing else there than the first folder `Qm...`

```bash
$ ls orbitdb/
QmNrPunxswb2Chmv295GeCvK9FDusWaTr1ZrYhvWV9AtGM/  zdpuB3VvBJHqYCocN4utQrpBseHou88mq2DLh7bUkWviBQSE3/

$ ls orbitdb/zdpuB3VvBJHqYCocN4utQrpBseHou88mq2DLh7bUkWviBQSE3/
pieces/

$ ls orbitdb/zdpuB3VvBJHqYCocN4utQrpBseHou88mq2DLh7bUkWviBQSE3/pieces/
000003.log  CURRENT  LOCK  LOG  MANIFEST-000002
```

You do not need to understand this fully for now, just know that it happened. Two subfolders, one being the original folder you saw when you instantiated OrbitDB, and now another that has the same address as your database.

### What else happened in the browser?

Similarly, a new IndexedDB database was created to hold your OrbitDB-specific info, apart from the data itself which are still stored in IPFS.

![An image showing the IPFS and OrbitDB IndexedDB databases in Firefox](../images/ipfs_browser_2.png)

This shows you one of OrbitDB's core strengths - the ability to manage a lot of complexity between its own internals and those of IPFS, providing a clear and clean API to manage the data that matters to you.

### Choosing a datastore

OrbitDB organizes its functionality by separating different data management concerns, schemas and APIs into **stores**. We chose a `docstore` for you in the last chapter, but after this tutorial it will be your job to determine the right store for the job.

Each OrbitDB store has its own specific API methods to create, delete, retrieve and update data. In general, you can expect to always have something like a `get` and something like a `put`.

You have the following choices:

| Name                                                                                              | Description                                                                                                                                                                     |
| ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **[log](https://github.com/orbitdb/orbit-db/blob/master/API.md#orbitdblognameaddress)**           | An _immutable_ (append-only) log with traversable history. Useful for *"latest N"* use cases or as a message queue.                                                             |
| **[feed](https://github.com/orbitdb/orbit-db/blob/master/API.md#orbitdbfeednameaddress)**         | A _mutable_ log with traversable history. Entries can be added and removed. Useful for *"shopping cart"* type of use cases, or for example as a feed of blog posts or "tweets". |
| **[keyvalue](https://github.com/orbitdb/orbit-db/blob/master/API.md#orbitdbkeyvaluenameaddress)** | A simple key-value database that supports any JSON-serializable data, even nested objects.                                                                                      |
| **[docs](https://github.com/orbitdb/orbit-db/blob/master/API.md#orbitdbdocsnameaddress-options)** | A document database that stores JSON documents which can be indexed by a specified key. Useful for building search indices or version controlling documents and data.           |
| **[counter](https://github.com/orbitdb/orbit-db/blob/master/API.md#orbitdbcounternameaddress)**   | An increment-only integer counter useful for counting events separate from log/feed data.                                                                                       |

Also, OrbitDB developers can write their own stores if it suits them. This is an advanced topic and is covered in Part 3 of this book.

### Key takeaways

- OrbitDB is a distributed database layer which stores its raw data in IPFS
- Both IPFS and OrbitDB work offline and online
- OrbitDB instances have an `id` which is the same as the underlying IPFS node's `id`.
- OrbitDB instances create databases which have each an unique `address` that includes a `manifest`
- Basic access rights to OrbitDB databases are managed using access control lists (or ACLs), based on the ID of the IPFS node performing the requests on the database
- OrbitDB database `manifests` are hashes of the database's ACL, its type, and its name.
- OrbitDB manages needed flexibility of schema and API design in functionality called **stores**.
- OrbitDB comes with a handful of stores, and you can write your own.
- Each store will have its own API, but you will generally have at least a `get` and a `put`
- Since OrbitDB and IPFS are written in JavaScript, it is possible to build isomorphic applications that run in the browser  and in Node.js

<strong>Now that you have laid the groundwork, you will learn how to work with data! Onward then, to [Chapter 2: Managing Data](./02_Managing_Data.md).</strong>

- Resolves #[367](https://github.com/orbitdb/orbit-db/issues/367)
- Resolves #[366](https://github.com/orbitdb/orbit-db/issues/366)
- Resolves #[502](https://github.com/orbitdb/orbit-db/issues/502)
