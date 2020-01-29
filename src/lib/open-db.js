const MongoClient = require('mongodb').MongoClient;

//create a database connection to mongo
const openDb = async function(options) {
  if (!options.mongo_name_db) {
    console.warn('\n--missing db name--');
  }
  const url = options.mongo_url;

  return new Promise((resolve, reject) => {
    MongoClient.connect(
      url,
      {
        useNewUrlParser: true
      },
      function(err, client) {
        if (err) {
          console.log(err);
          reject(err);
        }
        const db = client.db(options.mongo_name_db);
        const collection = db.collection(options.mongo_name_collection);
        //we use all of these.
        const obj = {
          db: db,
          col: collection,
          client: client
        };
        resolve(obj, client);
      }
    );
  });
};

module.exports = openDb;
