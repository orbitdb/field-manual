all: build

clean:
	rm -rf dist; mkdir dist;

tutorial: clean
	for f in 01*/*.md; do (cat $$f) >> dist/Book.md; done;
	pandoc -o dist/Book.ipynb metadata.yaml dist/Book.md;
	rm -rf dist/Book.md

build: clean tutorial
	for f in */*.md; do (echo "\n\\pagebreak\n\n"; cat $$f) >> dist/Book.md; done;
	pandoc --highlight-style=haddock -o dist/Book.pdf metadata.yaml dist/Book.md;
	pandoc --highlight-style=zenburn -o dist/Book.epub metadata.yaml dist/Book.md;
	pandoc --highlight-style=zenburn -o dist/Book.docx metadata.yaml dist/Book.md;
	pandoc --highlight-style=zenburn -o dist/Book.odt metadata.yaml dist/Book.md;
	rm -f dist/Book.md
