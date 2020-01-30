const cpuCount = require('os').cpus().length;

const defaults = {
    batch_size: 500,
    log_interval: 10000,
    namespace: 0,
    workers: cpuCount,
    encode: true,
    verbose: false,
    verbose_skip: false,  

    // Output configuration.
    wiki_dump_path: undefined,
    mongo_url: 'mongodb://localhost:27017/',
    mongo_id_concatenate: false,
    // The preferred configuration creates separate DB for each language file.
    // It's better for MongoDB, as it can store separate DBs in separate directories,
    // thus potentially storing them in different parts of SSD and achieving 
    // higher IOPs performance.
    // For that set: `mongo_name_db_auto: true`
    mongo_name_db: 'wiki',
    mongo_name_collection: 'pages',
    mongo_name_db_auto: false,
    mongo_name_collection_auto: false,
  
    // Stuff that we will pass to `wtf_wikipedia`.
    // Formatting settings.
    // https://github.com/spencermountain/wtf_wikipedia/blob/master/src/01-document/toJson.js
    images: true,
    references: true,
    citations: true,
    infoboxes: true,
    coordinates: true,
    categories: true,
    // We don't want to bloat the DB with original version.
    // Markdown may ne the only notable exception, as it's 
    // remarkably easy to both render and read in raw form.
    markdown: true,
    html: false,
    latex: false,
    skip_disambig: true,
    skip_redirects: true,
  };

  module.exports = defaults;
