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
	# Generate pdf
	docker run \
		--rm \
		--user $(uid):$(gid) \
		-v $(current_dir)/metadata.yaml:/metadata.yaml \
		-v $(current_dir)/dist:/dist \
		-v $(current_dir)/images:/images \
		--workdir /dist \
		pandoc/latex:2.14 --highlight-style=breezedark -o /dist/Book.pdf /metadata.yaml /dist/Book.md
	# Generate epub
	docker run \
		--rm \
		--user $(uid):$(gid) \
		-v $(current_dir)/metadata.yaml:/metadata.yaml \
		-v $(current_dir)/dist:/dist \
		-v $(current_dir)/images:/images \
		--workdir /dist \
		pandoc/latex:2.14 --highlight-style=breezedark -o /dist/Book.epub /metadata.yaml /dist/Book.md
	# Generate html
	docker run \
		--rm \
		--user $(uid):$(gid) \
		-v $(current_dir)/metadata.yaml:/metadata.yaml \
		-v $(current_dir)/dist:/dist \
		-v $(current_dir)/images:/images \
		--workdir /dist \
		pandoc/latex:2.14 --highlight-style=breezedark -o /dist/Book.html /metadata.yaml /dist/Book.md
