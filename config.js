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
  };

  module.exports = defaults;
