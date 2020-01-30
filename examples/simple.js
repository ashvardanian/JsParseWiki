const dumpster = require('../src');
const defaults = require('../config');
const read_folder = require('../src/lib/read-folder')

wiki_dump_paths = read_folder.recursiveFindByExtension('~/wiki_dumps', 'xml')
console.log('Will import following file:', wiki_dump_paths[0])

var configs = defaults
configs.wiki_dump_path = wiki_dump_paths[0]
dumpster(configs, () => {
    console.log('Finita!')
});
