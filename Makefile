current_dir = $(shell pwd)
uid = $(shell id -u)
gid = $(shell id -g)

all: build

clean:
	rm -rf dist; mkdir dist;

tutorial: clean
	for f in 01*/*.md; do (cat $$f) >> dist/Book.md; done;
	pandoc -o dist/Book.ipynb metadata.yaml dist/Book.md;
	rm -rf dist/Book.md

build: clean
	# Create Book.md by simply concatenating all .md files together
	for f in */*.md; do (echo "\n\\pagebreak\n\n"; cat $$f) >> dist/Book.md; done;
	# Run pandoc in Docker
	docker run \
		--rm \
		--user $(uid):$(gid) \
		-v $(current_dir)/metadata.yaml:/metadata.yaml \
		-v $(current_dir)/dist:/dist \
		-v $(current_dir)/images:/images \
		--workdir /dist \
		pandoc/latex:2.14 --highlight-style=breezedark -o /dist/Book.pdf /metadata.yaml /dist/Book.md
	# TODO: epub, odt, mobi, etc etc
	# pandoc --highlight-style=zenburn -o Book.epub metadata.yaml Book.md;
	# cd dist; pandoc --highlight-style=zenburn -o Book.docx ../metadata.yaml Book.md;
	# pandoc --highlight-style=zenburn -o Book.odt metadata.yaml Book.md;
	docker rmi pandoc/latex:2.14
	rm -f dist/Book.md
