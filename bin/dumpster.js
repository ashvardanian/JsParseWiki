#! /usr/bin/env node
let dumpster = require('../src');
let defaults = require('../config');
let yargs = require('yargs');
let argv = yargs
  .usage('dumpster <xml filepath> [options]')
  .example('dumpster ./my/wikipedia-dump.xml --plaintext true --categories false')
  .describe('log_interval', 'update interval [10000]')
  .describe('batch_size', 'how many articles to write to mongo at once [1000]')
  .describe('workers', 'run in verbose mode [CPUCount]')
  .describe('namespace', 'which wikipedia namespace to parse [0]')
  .describe('mongo_url', ' ["mongodb://localhost:27017/"]')
  .describe('mongo_name_db', ' ["wiki"]')

  // stuff that we will pass to `wtf_wikipedia`.
  .describe('skip_disambig', 'avoid storing disambiguation pages [true]')
  .describe('skip_redirects', 'avoid storing redirect pages [true]')
  .describe('categories', 'include category data? [true]')
  .describe('citations', 'include references/citations? [true]')
  .describe('coordinates', 'include coordinate data? [true]')
  .describe('infoboxes', 'include infobox data? [true]')
  .describe('images', 'include image data? [true]')
  .describe('markdown', 'include markdown output [false]')
  .describe('html', 'include html output [false]')
  .describe('latex', 'include latex output [false]')
  .describe('verbose', 'run in verbose mode [false]')
  .describe('verbose_skip', 'log skipped disambigs & redirects [false]')
  .argv;


const toBool = {
  true: true,
  false: false
};

//set defaults to given arguments
let options = Object.assign({}, defaults);
Object.keys(options).forEach(k => {
  if (argv.hasOwnProperty(k) && argv[k] !== undefined) {
    //coerce strings to booleans
    if (toBool.hasOwnProperty(argv[k])) {
      argv[k] = toBool[argv[k]];
    }
    options[k] = argv[k];
  }
});

//grab the wiki wiki_dump_path
let wiki_dump_path = argv['_'][0];
if (!wiki_dump_path) {
  console.log('❌ please supply a filename to the wikipedia article dump');
  process.exit(1);
} else {
  options.wiki_dump_path = wiki_dump_path;
}

//try to make-up the language name for the name_db
if (!options.mongo_name_db) {
  let name_db = 'wikipedia';
  if (wiki_dump_path.match(/-(latest|\d{8})-pages-articles/)) {
    name_db = wiki_dump_path.match(/([a-z]+)-(latest|\d{8})-pages-articles/) || [];
    name_db = name_db[1] || 'wikipedia';
  }
  options.mongo_name_db = name_db;  
}

dumpster(options);
