const fs = require('fs');
const path = require('path');
const stream = require('stream');

const encoding = 'utf8';
const bufferSize = 8;

const options = {
  // only read in 8 bits at a time
  highWaterMark: bufferSize,
  encoding,
};

const input$ = fs.createReadStream(path.join(__dirname, 'input.txt'), options);

input$.on('data', (chunk) => {
  console.log('data', chunk);
});

const output$ = fs.createWriteStream(path.join(__dirname, 'output.txt'), options);

input$.pipe(output$);