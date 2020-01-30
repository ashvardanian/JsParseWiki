#! /usr/bin/env node
let dumpster = require('../src');
let defaults = require('../config');
let read_folder = require('../src/lib/read-folder')
let yargs = require('yargs');
let fs = require('fs');

let argv = yargs
  .usage('dumpster <xml filepath> [options]')
  .example('dumpster ./my/wikipedia-dump.xml --plaintext true --categories false')
  
  .describe('log_interval', 'update interval [10000]')
  .describe('batch_size', 'how many articles to write to mongo at once [1000]')
  .describe('workers', 'run in verbose mode [CPUCount]')
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

// Check if we are parsing a single file or an entire directory.
let provided_path = argv['_'][0];
let wiki_dump_paths = []
if (!provided_path) {
  console.log('❌ please supply a filename to the wikipedia article dump');
  process.exit(1);
} else {
  if (fs.lstatSync(provided_path).isDirectory()) {
		wiki_dump_paths = read_folder.recursiveFindByExtension(provided_path, 'xml')
  } else {
		wiki_dump_paths = [provided_path];
  }
}

var options_per_path = []
for (var path of wiki_dump_paths) {
	var options_for_path = options
  options_for_path.wiki_dump_path = path

  //try to make-up the language name for the name_db
  if (!options.mongo_name_db || options.mongo_name_db_auto) {
		options_for_path.mongo_name_db = read_folder.suggestCollectionName(path) || 'wikipedia';  
  }
  if (!options.mongo_name_collection || options.mongo_name_collection_auto) {
		options_for_path.mongo_name_collection = read_folder.suggestCollectionName(path) || 'pages'; 
	}
	options_per_path.push(options_for_path)
}

dumpster(options_per_path);
