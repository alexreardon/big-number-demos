const leftPad = require('left-pad');

const args = process.argv.slice(2);
// add a space between all the arguments
const string = args.join(' ');

const result = string
  // split string into 16 bit chucks
  .split('')
  // get codepoint (might be a 1/2 of a surrogate pair)
  .map((arg, index) => string.charCodeAt(index).toString(16).toUpperCase())
  // pad values with '0'
  .map(code => `\\u${leftPad(code, 4, '0')}`)
  // join back together to one string
  .join('');

console.log(result);
