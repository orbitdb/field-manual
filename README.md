# The OrbitDB Field Manual

> An end-to-end tutorial, an in-depth look at OrbitDB's architecture, and even some philosophical musings about decentralization and the distributed industry. From the creators of OrbitDB.

<p align="left">
  <img src="images/orbit_db_logo_color.jpg" width="256" />
</p>

[![Gitter](https://img.shields.io/gitter/room/nwjs/nw.js.svg)](https://gitter.im/orbitdb/Lobby) [![Matrix](https://img.shields.io/badge/matrix-%23orbitdb%3Apermaweb.io-blue.svg)](https://riot.permaweb.io/#/room/#orbitdb:permaweb.io) [![Discord](https://img.shields.io/discord/475789330380488707?color=blueviolet&label=discord)](https://discord.gg/cscuf5T)

## What's in the book?

The book opens with **[an introduction](./00_Introduction)** that gives an overview of the promises and risks of the distributed space, and describes OrbitDB and its use cases at a high level.

**[The tutorial](./01_Tutorial/00_Introduction.md)** begins by guiding you through building a JavaScript application from scratch. You will work through: installation and database creation; managing and structuring your data; networking, communicating, and sharing data in a peer-to-peer fashion; and finally managing distributed identity and access to the databases. By the end of the tutorial, you should have everything you need.

Next, **[Thinking Peer to Peer](./02_Thinking_Peer_to_Peer)** is a collection of essays that approach peer-to-peer engineering from a more intellectual and philosophical perspective. It is light on code and heavy on ideas. It is also open for community members to contribute essays of their own, pending editorial review.

Then, **[The Architecture of OrbitDB](./03_The_Architecture_of_OrbitDB)** covers in-depth, in a more reference style, the  structured and architecture of OrbitDB. It includes a description of `ipfs-log`, the core of OrbitDB, the data `stores` and finally how the `orbit-db` library brings it all together into a single, cohesive package that works both in the browser and on the command line.

Finally, **[What comes next?](./04_What_Next)** provides some guidance and suggestions about subsequent topics you should explore. This section serves as a launch pad to further your understanding of how our distributed future will be built.

## How to read this book

While this book is best consumed by reading cover-to-cover, we understand that your time is valuable and you want to get the most out of it in the shortest amount of time. Here are some suggestions to digest the information efficiently.

If you are a technical person and want to use OrbitDB to build distributed, peer-to-peer applications, start with [Part 1: The tutorial](./01_Tutorial/00_Introduction.md), move to [Part 3: The Architecture of OrbitDB](./03_The_Architecture_of_OrbitDB), and then read chapters from [Part 2](./02_Thinking_Peer_to_Peer) and [Part 4](./04_What_Next) as necessary to fill in any knowledge gaps you may have.

If you do not want to write code, but instead want to understand peer-to-peer systems and architectures at a higher level, you should be able to get away with only reading [Part 2: Thinking Peer to Peer](./02_Thinking_Peer_to_Peer), and then moving on to [Part 4](./04_What_Next), followed by [Part 3](./03_The_Architecture_of_OrbitDB). 

Please note that we may repeat ourselves in different parts of the book. This is intentional because we cannot guarantee people will read the sections of the book in order. Please skim any sections that you already feel like you understand.

## Getting the book

Here you can download a copy of the book in the following free formats:

- [PDF](./dist/Book.pdf)

## Maintainers

Mark Henderson ([@aphelionz](https://github.com/aphelionz)) is the maintainer and lead author of the OrbitDB field manual. However, this work is built upon the efforts of many other people:

- [@haadcode](https://github.com/haadcode)
- [@shamb0t](https://github.com/shamb0t)
- [@vvp](https://github.com/vvp)
- [@RichardLitt](https://github.com/RichardLitt)
- [@sirfumblestone](https://github.com/sirfumblestone)

## Contributing

This is a _living_, _community-based_ document, which means it is for and can include _you_.

Anybody can:

1. give feedback on, or request modifications to, the tutorial;
2. submit an essay for inclusion in the "Thinking Peer to Peer" section.

To do so you are welcome to create a pull request.

Please look at and follow the [Code of Conduct](CODE_OF_CONDUCT.md).

### Building

Requires [`Pandoc`](https://pandoc.org/) to convert markdown to other formats.

1. Make your edits in the markdown files.
2. `npm run lint` to make sure your edits meet linting standards.
3. `npm run build` to populate the `dist` folder.
4. Manually audit the `dist` output to ensure no errors were made.
5. Create your PR!

## License

The OrbitDB Field Manual is released under the [Creative Commons Attribution-NonCommercial 4.0 International License](https://creativecommons.org/licenses/by-nc/4.0/) by Haja Networks Oy.

![CC BY-NC 4.0](./images/cc-by-nc.png)<br />
**Attribution-NonCommercial**<br />
**CC BY-NC**
