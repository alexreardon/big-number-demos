const newLineCodepoint = 10;

const myGetCharCodeAt = (str, index) => {
  const current = str.charCodeAt(index);
  const previous = str.charCodeAt(index - 1);

  // https://mathiasbynens.be/notes/javascript-encoding
  const isHighSurrogate = charCode => charCode >= 0xD800 && charCode <= 0xDBFF;

  if (!isNaN(previous) && isHighSurrogate(previous)) {
    // already handled - can return
    return false;
  }

  if (!isHighSurrogate(current)) {
    return current;
  }

  // is a high surrogate

  const next = str.charCodeAt(index + 1);

  if (isNaN(next)) {
    throw new Error('previous was a high surrogate but no match low surrogate found');
  }

  // could also use: (current - 0xD800) * 0x400 + next - 0xDC00 + 0x10000;
  // return `surrogate: ${str.codePointAt(index)} (${current}, ${next})`;
  return str.codePointAt(index);
};

const getCodePoints = str =>
  str.split('').map((char, index) => {
    return myGetCharCodeAt(str, index);
  })
    // remove surrogate pairs
    .filter(value => value !== false)
    // removing new line feeds
    .filter(value => value !== newLineCodepoint)
    .join(' ');

const args = process.argv.slice(2);

// called from command line
if (args.length) {
  console.log(getCodePoints(args.join(' ')));
  return;
}

// piped to
process.stdin.setEncoding('utf8');

process.stdin.on('data', (chunk) => {
  console.log(getCodePoints(chunk));
});