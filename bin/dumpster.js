#! /usr/bin/env node
let JsParseWiki = require('../src');
let defaults = require('../config');
let read_folder = require('../src/lib/read-folder')
let yargs = require('yargs');
let fs = require('fs');

let argv = yargs
  .usage('JsParseWiki <xml filepath> [options]')
  .example('JsParseWiki ./my/wikipedia-dump.xml --plaintext true --categories false')
  
  .describe('log_interval', 'update interval [10000]')
  .describe('batch_size', 'how many articles to write to mongo at once [1000]')
  .describe('workers', 'run in parallel mode. set to 0 to use all the cores [CPUCount]')
  .describe('namespace', 'which wikipedia namespace to parse [0]')
  .describe('verbose', 'run in verbose mode [false]')
  .describe('verbose_skip', 'log skipped disambigs & redirects [false]')

  // Output configuration.
  .describe('mongo_url', ' ["mongodb://localhost:27017/"]')
  .describe('mongo_name_db', ' ["wiki"]')
  .describe('mongo_name_collection', ' ["wiki"]')
  .describe('mongo_id_concatenate', 'concatenates the "pageID" and "title" into "_id" property of Mongo document [false]')

  // When running from a directory with multiple dump files, we can guess the name of each 
  // language and create a separate databases or separate collections for each file.
  .describe('mongo_name_db_auto', ' [false]')
  .describe('mongo_name_collection_auto', ' [false]')

  // Stuff that we will pass to `wtf_wikipedia`.
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

  .argv;


const toBool = {
  true: true,
  false: false
};

// Set defaults to given arguments.
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
options.wiki_dump_path = argv['_'][0];

console.log('parsed arguments are:', options)
JsParseWiki(options);
