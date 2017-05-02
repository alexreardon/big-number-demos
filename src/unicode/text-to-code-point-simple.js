// Array.from splits the string into surrogate pairs

const args = process.argv.slice(2);

const codepoints = Array.from(args.join(' '))
  .map(string => string.codePointAt(0))
  .join(' ');

process.stdout.write(codepoints);