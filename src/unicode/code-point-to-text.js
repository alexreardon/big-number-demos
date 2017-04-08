const getText = (numbers) =>
  numbers
    .map(number => String.fromCodePoint(number))
    .join('');

// const args = process.argv.slice(2);
process.stdin.setEncoding('utf8');

process.stdin.on('data', (chunk) => {
  console.log(getText(chunk.split(' ')));
});
