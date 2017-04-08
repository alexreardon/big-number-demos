const myGetCharCodeAt = (str, index) => {
  const current = str.charCodeAt(index);
  const previous = str.charCodeAt(index - 1);

  const isHighSurrogate = charCode => charCode >= 0xD800;

  if (!isNaN(previous) && isHighSurrogate(previous)) {
    // already handled - can return
    return false;
  }

  if (!isHighSurrogate(current)) {
    return current;
  }

  const next = str.charCodeAt(index + 1);

  if (isNaN(next)) {
    throw new Error('previous was a high surrogate but no match low surrogate found');
  }

  // is a high surrogate
  // console.info(`surrogate found: ${str.codePointAt(index)} (${current}, ${next})`);
  return str.codePointAt(index);
  // return `surrogate: ${str.codePointAt(index)} (${current}, ${next})`;
};

const getCodePoints = str => str
  .split('')
  .map((char, index) => {
    // console.log('code point', str.codePointAt(index));
    // return str.codePointAt(index);
    return myGetCharCodeAt(str, index);
  })
  .filter(value => value !== false)
  .join(' ');

const args = process.argv.slice(2);

// console.log('args', args.map(arg => {
//   return `${arg}: ${arg.length}`;
// }));

// console.log('normalised', args.join(' ').normalize('NFC'));

process.stdout.write(getCodePoints(args.join(' ')));