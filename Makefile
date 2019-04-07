all: build

clean:
	rm -rf dist; mkdir dist;

tutorial: clean
	for f in 01*/*.md; do (cat $$f) >> dist/Book.md; done;
	pandoc -o dist/Book.ipynb metadata.yaml dist/Book.md;
	rm -rf dist/Book.md

build: clean
	for f in */*.md; do (echo "\n\\pagebreak\n\n"; cat $$f) >> dist/Book.md; done;
	cd dist; pandoc --template=./eisvogel.tex -o Book.pdf ../metadata.yaml Book.md;
	# pandoc --highlight-style=zenburn -o Book.epub metadata.yaml Book.md;
	# cd dist; pandoc --highlight-style=zenburn -o Book.docx ../metadata.yaml Book.md;
	# pandoc --highlight-style=zenburn -o Book.odt metadata.yaml Book.md;
	rm -f dist/Book.md
