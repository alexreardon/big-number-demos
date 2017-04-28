const getText = (numbers) =>
  numbers
    .map(number => String.fromCodePoint(number))
    .join('');

const args = process.argv.slice(2);
// called from command line
if (args.length) {
  console.log(getText(args));
  return;
}

process.stdin.setEncoding('utf8');

process.stdin.on('data', (chunk) => {
  console.log(getText(chunk.split(' ')));
});
