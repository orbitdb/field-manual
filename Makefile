all: build

clean:
	rm -rf dist; mkdir dist;

build: clean
	for f in */*.md; do (echo "\n\\pagebreak\n\n"; cat $$f) >> dist/Book.md; done;
	pandoc --highlight-style=kate -o dist/Book.pdf metadata.yaml dist/Book.md;
	pandoc --highlight-style=kate -o dist/Book.epub metadata.yaml dist/Book.md;
	pandoc --highlight-style=kate -o dist/Book.docx metadata.yaml dist/Book.md;
	pandoc --highlight-style=kate -o dist/Book.odt metadata.yaml dist/Book.md;
	pandoc --highlight-style=kate -o dist/Book.ipynb metadata.yaml dist/Book.md;
	rm -f dist/Book.md
