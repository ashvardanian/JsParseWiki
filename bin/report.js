const chalk = require('chalk');
const openDb = require('../src/lib/open-db');
const niceNumber = require('../src/lib/fns').niceNumber;
const mongo_name_db = process.argv[2] || 'enwiki';

const showPage = async function(col) {
  let docs = await col.aggregate({
    $sample: {
      size: 1
    }
  });
  console.log(docs);
  console.log('\n\n\n');
};

//cool moves,
const main = async function() {
  let obj = await openDb({
    db: mongo_name_db
  });
  let count = await obj.col.count();
  console.log(chalk.blue('\n\n   ----------- ' + niceNumber(count) + ' pages total -----------\n'));
  await showPage(obj.col);
  await obj.client.close();
};
main();
