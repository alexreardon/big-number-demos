// @flow
// A buffer that contains Number.MAX_SAFE_INTEGER bytes
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Invalid_array_length
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer
const buffer = new ArrayBuffer(Math.pow(2, 30));
const view = new Uint8Array(buffer);

// view.forEach(chunk => console.log('chunk: ', chunk));

const overflowSize = 1;

export const add = (array1: Uint8Array, array2: Uint8Array): ?Uint8Array => {
  const biggestIndex = Math.max(array1.length, array2.length);

  // not supported
  if (biggestIndex + overflowSize > (Math.pow(2, 30))) {
    return null;
  }

  // needs to be able to contain one overflow byte
  const buffer = new ArrayBuffer(biggestIndex + overflowSize);
  const view = new Uint8Array(buffer);

  let shouldOverflow = false;

  for (let i = 0; i < biggestIndex || shouldOverflow; i++) {
    const sum =
      (shouldOverflow ? 1 : 0) +
      (array1[array1.length - 1 - i] || 0) +
      (array2[array2.length - 1 - i] || 0);

    shouldOverflow = sum > 255;

    view[biggestIndex - i - 1 + overflowSize] = shouldOverflow ? sum - 255 : sum;
  }

  return view;
};