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

console.log(getCodePoints(args.join(' ')));