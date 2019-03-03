# The OrbitDB Field Manual

> An end-to-end tutorial, an in-depth look at OrbitDB's architecture, and even some philsophical musings about decentralization and the distributed industry. From the creators of OrbitDB.

<p align="left">
  <img src="images/orbit_db_logo_color.jpg" width="256" />
</p>

[![Gitter](https://img.shields.io/gitter/room/nwjs/nw.js.svg)](https://gitter.im/orbitdb/Lobby)

TODO: Long Description

## What's in the book?

The book opens with **[an introduction](./00_Introduction)** that gives an overview of the promises and risks of the distributed space, and describes OrbitDB and its use cases at a high level.

Then, a fully **[hands-on tutorial](./01_Tutorial)** takes you through building an JavaScript application from scratch. You will work through installation and database creation, though managing and structuring your data, through networking, communication, and sharing data in a peer-to-peer fashion, and finally through managing distributed identity and access to the databases. By the end of the tutorial, you should have everything you need

However, this is only the beginning of your journey. 

- [Part 2: Thinking Peer to Peer](./02_Thinking_Peer_to_Peer)
- [Part 3: The Architecture of OrbitDB](./03_The_Architecture_of_OrbitDB)
- [Part 4: What comes next?](./04_What_next)
- [Appendices](./05_Appendices)

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

This is a _living_, _community-based_ document. Pull Requests are welcome and accepted. If you feel like you want to add or improvate a section, please create a PR and begin the discussion.

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
