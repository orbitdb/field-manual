all: build

build:
	rm -rf dist;
	mkdir dist;
	for f in */*.md; do (echo "\\pagebreak"; cat $f) >> dist/Book.md; done;
	pandoc --highlight-style=kate -o dist/Book.pdf metadata.yaml dist/Book.md;

	pandoc -o Book.
