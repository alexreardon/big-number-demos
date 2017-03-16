// @flow

// type Options = {|
//   maxLength: number
//   |}
// //options: ?Options = { maxLength: Math.pow(2, 30) }

// strategy:
// operate from right to left
export const add = (value1: string, value2: string): ?string => {
  const maxSize = Math.max(value1.length, value2.length);
  let digitToCarry = 0;
  let result = '';

  for (let i = maxSize - 1; i > 0; i--) {
    const digit1 = Number(value1.charAt(i)) || 0;
    const digit2 = Number(value2.charAt(i)) || 0;

    const sum = digit1 + digit2 + digitToCarry;
    const isTooBig = sum > 10;
    const resultDigit = isTooBig ? sum - 10 : sum;
    result = `${resultDigit}${result}`;
    digitToCarry = isTooBig ? Number(String(sum).charAt(0)) : 0;
  }
};

export const subtract = (value1: string, value2: string): ?string => {

};