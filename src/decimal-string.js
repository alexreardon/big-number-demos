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

const isBigger = (original: string, target: string): boolean => {
  if (original.length != target.length) {
    return original.length > target.length;
  }

  // lengths are the same - now need to figure out which is bigger
  for (let i = 0; i < original.length; i++) {
    const number1 = Number(original.charAt(i));
    const number2 = Number(target.charAt(i));
    if (number1 !== number2) {
      return number1 > number2;
    }
  }

  return false;
};

const replaceAt = (original: string, index: number, insert: string) =>
  `${original.substr(0, index)}${insert}${original.substr(insert.length + index)}`;

const removeLeadingZeros = (value: string): string => {
  let isFirstValueFound = false;
  return value.split('')
    .filter((val: string) => {
      if (isFirstValueFound) {
        return true;
      }
      if (val !== '0') {
        isFirstValueFound = true;
        return true;
      }
      return false;
    })
    .join('');
};

const getSubtraction = (bigger: string, smaller: string): ?string => {
  let result = '';

  for (let index = 0; index < bigger.length; index++) {
    const digit1Position = bigger.length - 1 - index;
    const digit2Position = smaller.length - 1 - index;
    const digit1 = Number(bigger.charAt(digit1Position));

    if (digit2Position < 0) {
      //TODO: could optimise and just return the remaning digits of bigger
      result = `${digit1}${result}`;
      // if (isNoMoreWorkRequired(digit1Position)) {
      //   break;
      // }
      continue;
    }

    const digit2 = Number(smaller.charAt(digit2Position));

    if (digit2 <= digit1) {
      result = `${digit1 - digit2}${result}`;
      continue;
    }

    // digit2 is greater than digit1
    // need to borrow some more digits from bigger
    for (let searchPosition = digit1Position - 1; searchPosition >= 0; searchPosition--) {
      const getUpdatedBigger = replaceAt.bind(null, bigger, searchPosition);

      // if you cannot grab anything - set it to 9 and keep going up
      if (bigger.charAt(searchPosition) === '0') {
        bigger = getUpdatedBigger('9');
        continue;
      }
      // found something we can use!
      bigger = getUpdatedBigger(String(Number(bigger.charAt(searchPosition)) - 1));
      break;
    }

    result = `${(digit1 + 10) - digit2}${result}`;
  }

  return removeLeadingZeros(result);
};

export const subtract = (original: string, target: string): ?string => {
  if (original === target) {
    return '0';
  }

  const isOriginalBigger = isBigger(original, target);
  const args = isOriginalBigger ? [original, target] : [target, original];
  const result = getSubtraction(...args);

  if (result == null) {
    return null;
  }

  return `${isOriginalBigger ? '' : '-'}${result}`;
};