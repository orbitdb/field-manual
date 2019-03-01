# The OrbitDB Field Manual

> Straight from the creators of OrbitDB. Contains an end-to-end tutorial, an in-depth look at OrbitDB's underlying architecture, and even some philsophical musings about decentralization and the distributed industry.

TODO: Long Description

## Usage

You can download a copy of the book from this repository, either in the releases section or directly from the code.

Currently, The OrbitDB Field Manual is available for download in the following formats

- [PDF](./dist/Book.pdf)

TODO:

- [ ] Other download options (mobi, epub, etc)
- [ ] Hard copy purchase options?

## Table of Contents

This is a table of contents of the book
- [Introduction](./00_Introduction)
- [Part 1: Tutorial](./01_Tutorial)
- [Part 2: Thinking Peer to Peer](./02_Thinking_Peer_to_Peer)
- [Part 3: The Architecture of OrbitDB](./03_The_Architecture_of_OrbitDB)
- [Part 4: What comes next?](./04_What_next)
- [Appendices](./05_Appendices)

## Maintainers

Mark Henderson (@aphelionz) is the maintainer and lead author of the OrbitDB field manual. However, this work is built upon the work and input of many other people

- @haadcode
- @shamb0t
- @v-v
- @RichardLitt
- @sirfumblestone

## Contributing

This is a _living_, _community-based_ document. PRs are accepted! 

If you feel like you want to add or improvate a section, please create a pull request and begin the discussion.

### Building

Requires `[Pandoc](https://pandoc.org/)` to convert markdown to other formats.

1. Make your edits in the markdown files
2. `npm run lint` to make sure your edits meet linting standards
3. `npm run build` to populate the `dist` folder
4. Manually audit the `dist` output to ensure no errors were made
5. Create your PR!

## License

TBD
