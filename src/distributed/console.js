const stream = require('stream');
const input$ = process.stdin;

const exitKey = '\u0003';

// read character by character
input$.setRawMode(true);
input$.setEncoding('utf8');

input$.on('data', (char) => {
  console.log('data recieved:', char);

  if (char === exitKey) {
    process.exit();
  }
});