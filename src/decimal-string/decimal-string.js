// @flow
import invariant from 'invariant';

type Options = {|
  maxLength: number
    |}

// https://regex101.com/r/DT8BYP/1
// group 1 = sign (optional '-')
// group 2 = integer component
// group 3 = decimal
const supportedNumberFormat = /^(-?)(\d+)(?:\.(\d+))?$/;

const isFormatSupported = (value: string): boolean =>
  supportedNumberFormat.test(value);

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

const validateArgs = (fn: Function) => {
  return (...args: string[]) => {
    args.forEach((arg) => {
      if (!isFormatSupported(arg)) {
        throw new Error(`invalid number format: ${arg}`);
      }
    });

    return fn(...args);
  };
};

const isEqual = (original: string, target: string): boolean =>
  original === target;

export const isGreaterThan = validateArgs((original: string, target: string): boolean => {
  const sanitised = getTermsWithEqualDecimalComponents(original, target);
  if (sanitised === null) {
    return false;
  }

  const { term1, term2 } = sanitised;

  if (term1.length !== term2.length) {
    return term1.length > term2.length;
  }

  // lengths are the same - now need to figure out which is bigger
  for (let i = 0; i < term1.length; i++) {
    const number1 = Number(term1.charAt(i));
    const number2 = Number(term2.charAt(i));
    if (number1 !== number2) {
      return number1 > number2;
    }
  }

  return false;
});

const isLessThan = (original: string, target: string): boolean =>
  !isEqual(original, target) && !isGreaterThan(original, target);

const getAddition = (term1: string, term2: string, options?: Options = defaultOptions): ?string => {
  const maxDigitLength = Math.max(term1.length, term2.length);

  let digitToCarry = 0;
  let result = '';

  for (let i = 0; i < maxDigitLength || digitToCarry != 0; i++) {
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

// Can combine comparision operators to create new ones
// Useful but unused at this stage.
//const combine = (...functions: Function[]) => (...args: string[]) =>
//  functions.every((fn: Function) => Boolean(fn(...args)));

const either = (...functions: Function[]) => (...args: string[]) =>
  functions.some((fn: Function) => Boolean(fn(...args)));

export const isGreaterThanOrEqualTo = either(isEqual, isGreaterThan);
export const isLessThanOrEqualTo = either(isEqual, isLessThan);

const addZeros = (value: string, count: number): string => {
  const zeros = Array.from({ length: count }).map(() => '0').join('');
  return `${value}${zeros}`;
};

const removeLeadingZeros = (value: string): string => {
  if (value.charAt(0) === '0') {
    invariant(value.length, 'cannot remove leading zeros from invalid number');
    // drop the first character
    return removeLeadingZeros(value.slice(1, value.length));
  }

  // add a zero in
  if (value.charAt(0) === '.') {
    return `0${value}`;
  }

  return value;
};

// using recursion - but should be okay with ES6 tail call optimization
// removes unneeded digits and decimal point
const removeTrailingZeros = (value: string): string => {
  if (value.charAt(value.length - 1) === '0') {
    // remove trailing zero and move on
    return removeTrailingZeros(value.slice(0, value.length - 1));
  }

  // Reached a '.' without any decimals.
  // Remove the decimal point an return the value.
  if (value.charAt(value.length - 1) === '.') {
    return value.slice(0, value.length - 1);
  }

  // a value found that is not '0' or '.'
  return value;
};

const removeDecimalPoint = (value: string): string => value.replace('.', '');

type Components = {
  term1: string,
  term2: string,
  decimalOffset: number
}

const getTermsWithEqualDecimalComponents = (term1: string, term2: string): Components => {
  const term1HasADecimal = term1.includes('.');
  const term2HasADecimal = term2.includes('.');

  if (!term1HasADecimal && !term2HasADecimal) {
    return {
      term1,
      term2,
      decimalOffset: 0,
    };
  }

  const term1DecimalOffset = term1HasADecimal ? (term1.length - 1) - term1.indexOf('.') : 0;
  const term2DecimalOffset = term2HasADecimal ? (term2.length - 1) - term2.indexOf('.') : 0;

  if (term1DecimalOffset === term2DecimalOffset) {
    return {
      term1: removeDecimalPoint(term1),
      term2: removeDecimalPoint(term2),
      decimalOffset: term1DecimalOffset,
    };
  }

  // TODO: this may exceed the max size of a string

  // term2 is bigger
  if (term1DecimalOffset > term2DecimalOffset) {
    return {
      term1: removeDecimalPoint(term1),
      term2: removeDecimalPoint(addZeros(term2, term1DecimalOffset - term2DecimalOffset)),
      decimalOffset: term1DecimalOffset,
    };
  }

  // term2 is bigger
  return {
    term1: removeDecimalPoint(addZeros(term1, term2DecimalOffset - term1DecimalOffset)),
    term2: removeDecimalPoint(term2),
    decimalOffset: term2DecimalOffset,
  };

};

export const add = (term1: string, term2: string, options?: Options = defaultOptions): ?string => {
  invariant(isFormatSupported(term1) && isFormatSupported(term2), 'terms must be formatted correctly');

  const sanitised = getTermsWithEqualDecimalComponents(term1, term2);
  if (sanitised === null) {
    return null;
  }

  const result = getAddition(sanitised.term1, sanitised.term2, options);
  if (result == null) {
    return null;
  }

  // no decimal manipulation required
  if (sanitised.decimalOffset === 0) {
    return formatOutput(result);
  }

  const decimalIndex = result.length - sanitised.decimalOffset;
  return formatOutput(`${result.slice(0, decimalIndex)}.${result.slice(decimalIndex)}`);
};

const replaceAt = (original: string, index: number, insert: string) =>
  `${original.substr(0, index)}${insert}${original.substr(insert.length + index)}`;

const formatOutput = (value: string): string => {
  const hasDecimal = value.includes('.');
  if (!hasDecimal) {
    return removeLeadingZeros(value);
  }

  return removeLeadingZeros(removeTrailingZeros(value));
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

  return result;
};

export const subtract = validateArgs((term1: string, term2: string): ?string => {
  if (isEqual(term1, term2)) {
    return '0';
  }

  const sanitised: Components = getTermsWithEqualDecimalComponents(term1, term2);
  if (sanitised == null) {
    return null;
  }

  const isTerm1Bigger = isGreaterThan(sanitised.term1, sanitised.term2);
  const args = isTerm1Bigger ? [sanitised.term1, sanitised.term2] : [sanitised.term2, sanitised.term1];
  const result = getSubtraction(...args);

  if (result == null) {
    return null;
  }

  const sign = `${isTerm1Bigger ? '' : '-'}`;

  if (sanitised.decimalOffset === 0) {
    return `${sign}${formatOutput(result)}`;
  }

  const decimalIndex = result.length - sanitised.decimalOffset;
  const unformattedResult = `${result.slice(0, decimalIndex)}.${result.slice(decimalIndex)}`;
  return `${sign}${formatOutput(unformattedResult)}`;

  // const resultWithDecimal = removeTrailingZerosFromDecimal(`${result.slice(0, decimalIndex)}.${result.slice(decimalIndex)}`);
  // const integerPrefix = resultWithDecimal.charAt(0) === '.' ? '0' : '';
  // return `${sign}${integerPrefix}${resultWithDecimal}`;
});

export const multiply = validateArgs((value: string, multiplyBy: string) => {
  if (multiplyBy === '0') {
    return '0';
  }

  if (multiplyBy === '1') {
    return value;
  }

  if (value === '1') {
    return multiplyBy;
  }

  let count = '0';
  let result = '0';
  while (count !== multiplyBy) {
    const newCount = add(count, '1');
    const newResult = add(result, value);
    if (newCount == null || newResult == null) {
      return null;
    }
    count = newCount;
    result = newResult;
  }

  return result;
});

export const divide = validateArgs((value: string, divideBy: string) => {
  if (divideBy === '0') {
    return null;
  }

  if (divideBy === '1') {
    return value;
  }

  if (value === divideBy) {
    return '1';
  }

  let count = '0';
  let remainder = value;
  while (isGreaterThanOrEqualTo(remainder, divideBy)) {
    const newCurrent = subtract(remainder, divideBy);
    const newCount = add(count, '1');

    if (newCount == null || newCurrent == null) {
      return null;
    }

    count = newCount;
    remainder = newCurrent;
  }

  // no decimal component
  if (remainder === '0') {
    return count;
  }

  return `${count} + ${remainder}/${divideBy}`;
});