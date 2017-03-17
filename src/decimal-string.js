// @flow

type Options = {|
  maxLength: number
    |}

// Max string sizes
// ## IE9
// http://stackoverflow.com/questions/13367391/is-there-a-limit-on-length-of-the-key-string-in-js-object
// max size: 2^30
//
// ## ES7
// http://www.ecma-international.org/ecma-262/7.0/index.html#sec-ecmascript-language-types-string-type
// max size: 2^53 - 1
// this is the same as Number.MAX_SAFE_INTEGER so string.length will always return a valid number

const maxStringLength = Math.pow(2, 30);

const defaultOptions: Options = { maxLength: maxStringLength };

export const add = (term1: string, term2: string, options?: Options = defaultOptions): ?string => {
  const maxValueLength = Math.max(term1.length, term2.length);
  let digitToCarry = 0;
  let result = '';

  for (let i = 0; i < maxValueLength || digitToCarry != 0; i++) {
    if (result.length + 1 > options.maxLength) {
      return null;
    }

    // reading numbers from right to left

    const digit1 = Number(term1.charAt(term1.length - 1 - i)) || 0;
    const digit2 = Number(term2.charAt(term2.length - 1 - i)) || 0;

    const sum = digit1 + digit2 + digitToCarry;
    const isTooBig = sum >= 10;
    const resultDigit = isTooBig ? sum - 10 : sum;
    result = `${resultDigit}${result}`;
    digitToCarry = isTooBig ? Number(String(sum).charAt(0)) : 0;
  }

  return result;
};

export const subtract = (term1: string, term2: string): ?string => {
  let result = '';
  const maxValueLength = Math.max(term1.length, term2.length);

  for (let i = 0; i < maxValueLength; i++) {
    const digit1Index = term1.length - 1 - i;
    const digit2Index = term2.length - 1 - i;

    // no more digits left in term1
    if (digit1Index < 0) {
      const remainingDigitsInTerm2 = term2.substr(0, digit2Index);
      return `-${remainingDigitsInTerm2}${result}`;
    }

    const digit1 = Number(term1.charAt(digit1Index)) || 0;
    const digit2 = Number(term2.charAt(digit2Index)) || 0;

    // easy case
    const total = digit1 - digit2;
    if (total >= 0) {
      const isLastIteration = i == maxValueLength - 1;
      if (isLastIteration) {
        return total > 0 ? `${total}${result}` : result;
      }

      result = `${total}${result}`;
      continue;
    }

    // need to borrow numbers from other digits if we can
    // need to find a previous digit from term1 that has a value > 0
    // TODO: if there are no more digits left on term1 then we are done..?

    // const remainingDigits = term1.substr(0, term1.length - 1 - i);

    let closestNonZeroIndex = -1;
    const nextPosition = i + 1;
    for (let x = nextPosition; x >= 0; x--) {
      if (term1.charAt(x - 1) !== '0') {
        closestNonZeroIndex = x - 1;
        break;
      }
    }

    // nothing can be grabbed from term1
    if (closestNonZeroIndex == -1) {
      const remainingDigits = term2.substr(0, term2.length - i);
      return `-${remainingDigits}${result}`;
    }

    // something can be grabbed from term1
    term1 = term1.split('')
      .map((val: string, index: number): string => {
        // need to decrement the value at term1[closestNonZeroIndex]
        if (index == closestNonZeroIndex) {
          return `${Number(val) - 1}`;
        }
        // need to set everything between closestNonZeroIndex and i to '9'
        if (index > closestNonZeroIndex && index < (term1.length - 1 - i)) {
          return '9';
        }
        // unmodified
        return val;
      })
      .join('');

    const resultDigit = (digit1 + 10) - digit2;
    result = `${resultDigit}${result}`;
  }

  return result;
};