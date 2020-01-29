const cpuCount = require('os').cpus().length;

const defaults = {
    batch_size: 500,
    log_interval: 10000,
    namespace: 0,
    workers: cpuCount,
    encode: true,

    wiki_dump_path: undefined,
    mongo_url: 'mongodb://localhost:27017/',
    mongo_name_db: 'wiki',
    mongo_name_collection: 'pages',
    //if we are importing the entire dump we may want to assign 
    //different artificial IDs to avoid collisions across same 
    //titles in different languages.
    disambiguate_language_by_id_prefix: false,
  };

  module.exports = defaults;
