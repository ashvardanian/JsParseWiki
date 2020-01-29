const chalk = require('chalk');
const fs = require('fs');
const defaults = require('../config');

const guardIO = function(options) {
  if (!options.wiki_dump_path || !fs.existsSync(options.wiki_dump_path)) {
    console.log(chalk.red('\n  --can\'t find file:  "' + chalk.blue(options.wiki_dump_path) + '" ---'));
    console.log(
      chalk.grey('     please supply a filename for the wikipedia article dump in xml format')
    );
    process.exit(1);
  }
  if (/\.bz2$/.test(options.wiki_dump_path)) {
    console.log(chalk.red('\n    --- hello, please unzip this file first  ---'));
    console.log(chalk.grey('     ($ bzip2 -d ' + options.wiki_dump_path + ' )'));
    process.exit(1);
  }
};

//a little housework first, for our config object
const validateOptions = function(options) {
  options = options || {};
  for (var attrname in defaults) { 
    if (options[attrname] === undefined) {
      options[attrname] = defaults[attrname]; 
    }
  }

  //make sure the file looks good..
  guardIO(options);

  //some top-level logging
  process.on('unhandledRejection', function(up) {
    console.log(chalk.red('--uncaught top-process error--'));
    return console.log(up);
  });
  return options;
};
module.exports = validateOptions;
