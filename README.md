# The OrbitDB Field Manual

> An end-to-end tutorial, an in-depth look at OrbitDB's architecture, and even some philsophical musings about decentralization and the distributed industry. From the creators of OrbitDB.

<p align="left">
  <img src="images/orbit_db_logo_color.jpg" width="256" />
</p>

[![Gitter](https://img.shields.io/gitter/room/nwjs/nw.js.svg)](https://gitter.im/orbitdb/Lobby)

TODO: Long Description

## What's in the book?

The book opens with **[an introduction](./00_Introduction)** that gives an overview of the promises and risks of the distributed space, and describes OrbitDB and its use cases at a high level.

**[The tutorial](./01_Tutorial)** at the beginning takes you through building an JavaScript application from scratch. You will work through installation and database creation, though managing and structuring your data, through networking, communication, and sharing data in a peer-to-peer fashion, and finally through managing distributed identity and access to the databases. By the end of the tutorial, you should have everything you need

The next part of the book, **[Thinking Peer to Peer](./02_Thinking_Peer_to_Peer)** involves _you_. It is a collection of essays that approach peer-to-peer engineering from a more intellectual and philsophical aspect. It is light on code and heavy on ideas. It is also open for community members to submit essays of their own for inclusing, pending an editorial review. 

**[Part 3: The Architecture of OrbitDB](./03_The_Architecture_of_OrbitDB)** coveres in-depth, in a more reference style, how OrbitDB is structured and architected. It includes a description of `ipfs-log`, the core of OrbitDB, the data `stores` and finally into how the `orbit-db` library packages it all together into a single, cohesive package that works in both the browser and the command line.

The closing part of the book, **[What comes next?](./04_What_next)** provides some guidance and suggestions into the next topics you explore. This will serve as a launch pad to further amplify your understanding of how our distributed future will be built.

## Getting the book

You can download a copy of the book for here, available for download in the following free formats:

- [PDF](./dist/Book.pdf)
- [EPUB](./dist/Book.epub)
- [ODT](./dist/Book.odt)
- [Jupyter Notebook (Tutorial Only)](./dist/Book.ipynb)

## Maintainers

Mark Henderson (@aphelionz) is the maintainer and lead author of the OrbitDB field manual. However, this work is built upon the work and input of many other people:

- @haadcode
- @shamb0t
- @v-v
- @RichardLitt
- @sirfumblestone

## Contributing

This is a _living_, _community-based_ document, which means it is for and can include _you_. 

Anybody can:

1. Give feedback on, or request modifications to, the tutorial
2. Submit an essay for inclusion in the "Thinking Peer to Peer" section. 

To do so, create a pull request, which are are welcome and accepted.

### Building

Requires [`Pandoc`](https://pandoc.org/) to convert markdown to other formats.

1. Make your edits in the markdown files
2. `npm run lint` to make sure your edits meet linting standards
3. `npm run build` to populate the `dist` folder
4. Manually audit the `dist` output to ensure no errors were made
5. Create your PR!

## License

The OrbitDB Field Manual is released under the [Creative Commons Attribution-NonCommercial 4.0 International License](https://creativecommons.org/licenses/by-nc/4.0/)

![CC BY-NC 4.0](./images/cc-by-nc.png)<br />
**Attribution-NonCommercial**<br />
**CC BY-NC**
