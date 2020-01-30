const chalk = require('chalk');
const sundayDriver = require('sunday-driver');
const parsePage = require('./01-parse-page');
const parseWiki = require('./02-parse-wiki');
const writeDb = require('./03-write-db');
const jsonfn = require('jsonfn').JSONfn;
const niceNum = require('../lib/fns').niceNumber;


const doWorkersPartInEveryFile = async (optionStr, workerCount, workerNum) => {
  const options = jsonfn.parse(optionStr);
  if (typeof options.wiki_dump_path == "string") {
    return _doWorkersPartInOneFile(options, workerCount, workerNum)
  } else if (typeof options.wiki_dump_path == "array") {
    for (var path of options.wiki_dump_path) {
      var optionsCopy = options
      optionsCopy.wiki_dump_path = path
      return _doWorkersPartInOneFile(optionsCopy, workerCount, workerNum)
    }
  }
}

const doWorkersPartInOneFile = async (options, workerCount, workerNum) => {
  const options = jsonfn.parse(optionStr);
  return _doWorkersPartInOneFile(options, workerCount, workerNum)
}

const _doWorkersPartInOneFile = async (options, workerCount, workerNum) => {
  let pages = [];
  const percent = 100 / workerCount;
  const start = percent * workerNum;
  const end = start + percent;
  this.counts = {
    pages: 0,
    redirects: 0,
    ns: 0,
    disambig: 0
  };
  this.logger = setInterval(() => {
    console.log(`      ${chalk.yellow('─── worker #' + workerNum + ' ───')}: `);
    console.log(`         ${chalk.green('+' + niceNum(this.counts.pages))} ${chalk.grey('pages')}`);
    console.log(
      `         ${chalk.magenta(niceNum(this.counts.redirects * -1))} ${chalk.grey('redirects')}`
    );
    console.log(
      `         ${chalk.magenta(niceNum(this.counts.disambig * -1))} ${chalk.grey('disambig')}`
    );
    console.log(`         ${chalk.magenta(niceNum(this.counts.ns * -1))} ${chalk.grey('ns')}`);
  }, 20000 + workerNum * 15);
  // console.log(`#${workerNum} -   ${start}% → ${end}%`)
  const driver = {
    file: options.wiki_dump_path,
    start: `${start}%`,
    end: `${end}%`,
    splitter: '</page>',
    each: (xml, resume) => {
      // pull-out sections from this xml
      let page = parsePage(xml, this, options);
      if (page !== null) {
        if (options.verbose === true) {
          console.log('   #' + workerNum + '  - ' + page.title);
        }
        //parse the page into json
        page = parseWiki(page, options, this);
        if (page !== null) {
          pages.push(page);
        }
      }
      if (pages.length >= options.batch_size) {
        writeDb(options, pages, workerNum).then(() => {
          this.counts.pages += pages.length;
          pages = [];
          resume();
        });
      } else {
        resume();
      }
    }
  };
  const p = sundayDriver(driver);
  p.catch(err => {
    console.log(chalk.red('\n\n========== Worker error!  ====='));
    console.log('🚨       worker #' + workerNum + '           🚨');
    console.log(err);
    console.log('\n\n');
  });
  p.then(async () => {
    //on done
    clearInterval(this.logger);
    // insert the remaining pages
    if (pages.length > 0) {
      await writeDb(options, pages, workerNum);
    }
    console.log('\n');
    console.log(`    💪  worker #${workerNum} has finished 💪 `);
    process.send({
      type: 'workerDone',
      pid: process.pid
    });
  });
  return process.pid;
};

module.exports = {
  doWorkersPartInEveryFile: doWorkersPartInEveryFile,
  doWorkersPartInOneFile: doWorkersPartInOneFile
};
