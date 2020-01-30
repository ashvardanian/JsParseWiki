
const defaults = {
    batch_size: 500,
    log_interval: 10000,
    namespace: 0,
    workers: 1,
    encode: true,
    verbose: false,
    verbose_skip: false,  

    // Output configuration.
    wiki_dump_path: undefined,
    mongo_url: 'mongodb://localhost:27017/',
    mongo_id_concatenate: false,
    // We recommend storing every language in separate DB.
    // It's better for MongoDB, as it may store them in 
    // different parts of SSD and achieve higher IOPs performance.
    mongo_name_db: 'wiki',
    mongo_name_collection: 'pages',
  
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
