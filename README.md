# JsParseWiki

JavaScript app that parses Wikipedia dumps and imports them into MongoDB. 
This fork supports remote DB authetification and is slightly refactored..
As the original version, it uses [worker-nodes](https://github.com/allegro/node-worker-nodes) to process pages in parallel, and [wtf_wikipedia](https://github.com/spencermountain/wtf_wikipedia) to turn **WikiScript** into JSON.

[![npm badge](https://img.shields.io/npm/v/dumpster-dive.svg?style=flat-square)](https://npmjs.org/package/dumpster-dive "package")
[![codacy](https://api.codacy.com/project/badge/grade/6fad3c588d3d4c97ab8a9abf9f2a5a01)](https://www.codacy.com/app/spencerkelly86/dumpster-dive "codacy")

## Install

This version:
```sh
$ npm install -g ashvardanian/JsParseWiki
```

Original [version](https://github.com/spencermountain/dumpster-dive):
```sh
$ npm install -g dumpster-dive
```

## Usage

```sh
wget -O archieve.xml.bz2 https://some.wiki.dump
# Decompress using the parallel Zip utility with 8 threads.
lbzip2 -d -n 8 -v archieve.xml.bz2
# Run this JS module.
npx JsParseWiki archieve.xml \
	--workers=8 \
	--mongo_url=mongodb://user:password@localhost:27017 \
	--mongo_name_db=wiki \
	--mongo_name_collection=pages
# Remove the dump.
rm archieve.xml
```
