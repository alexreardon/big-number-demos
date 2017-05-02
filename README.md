# Big number demos

Hi there! This repo contains a few assorted tools and scripts associated with doing big numbers in JavaScript. It is designed to be a companion to my talk at [jsconf.eu 2017](http://2017.jsconf.eu/speakers/alexander-reardon-lets-go-big.html).

The code in this repo is **not intended for production use** and is intended only for illustrative purposes. If you are looking for a production supported big number implementation check out [bignumber.js](https://github.com/MikeMcl/bignumber.js/)

## Decimal string (`/decimal-string`)

This is the most feature rich big number implementation. It contains a mostly working number system written using base 10 decimal strings (eg `'-0.202'`).

To see the tests for this system run `yarn run test`. It supports a suprising amount of use cases.

## Typed arrays (`/typed-arrays`)

This is very basic implementation of big numbers using typed arrays. It treats the values as if they are formatted in with the smallest values on the left (LTR) rather than how numbers usually work with the smallest values on the right (RTL). This implementation is super limited and only supports a basic `add` function.

There are some basic tests for this system which you can run using `yarn run test`.

## File adder (`/file-adder`)

This little program reads in the utf8 files `input1` and `input2` one byte (one digit) at a time. It then adds the digits and saves the output one digit at a time to `output`. If the sum of the values is greater than `10` it carries the `10` to the next addition. This file can be used as the basis to add numbers that are much bigger in memory size then node could process in memory.

How it works:

- open a file stream to `input1` and `input2`
- read in one digit at a time from each file
- add the digits from the files
- save the output one digit at a time to `output`.

You can run this application by executing:

```bash
yarn run file-adder
```

*Limitations for simplicity*
- It reads in values left to right which means that it treats numbers in the reverse order to what we usually store numbers (right to left).
- It assumes that the input files are of the same length

## Increasing the amount of memory `node` has

If you want to store numbers in strings you can need up to `268.4 MB` to store one string. You can find yourself quickly hitting up against the [1.76 GB memory allowance](http://prestonparry.com/articles/IncreaseNodeJSMemorySize/) (heap size) for node.

This little script will create a `node` process with 8GB of memory and then print some details about the heap sizes:

```bash
yarn run print-big-heap
```

## Unicode helpers (`/unicode`)

One of the approaches for big numbers that I put forward is the use of strings. In order to work with strings correctly you need to know about how they work. While I was putting my talk together I created a number of helpers that allowed me to

There are collection of unitilities in this folder that help expose the inner workings of unicode and JavaScript character encoding.

### `text-to-code-point.js`

This file takes an input string and will return you the unicode code points for every character

```js
node src/unicode/text-to-code-point.js hello world
// 104 101 108 108 111 32 119 111 114 108 100

node src/unicode/text-to-code-point.js 👌
// 128076
```

You can use this in combination with `code-point-to-text.js` to get the original text:

```js
node src/unicode/text-to-code-point.js hello world | node src/unicode/code-point-to-text.js
// hello world
```

### `text-to-code-point-simple.js`

This has the same functionality as `text-to-code-point` but uses a different mechanism. This one relies on the fact that `Array.from('string')` splits the string into codepoints directly while correctly treating surrogate pairs as single codepoints.

### `code-point-to-text.js`

This file takes a series of unicode code points and converts them into text. This is the inverse of `text-to-code-point.js`.

```js
node src/unicode/code-point-to-text.js 128512
// 😀
```

You can use this in combination with `text-to-code-point.js` to get the original codepoint:

```js
node src/unicode/code-point-to-text.js 128512 | node src/unicode/text-to-code-point.js
// 128512
```

### `get-raw-unicode.js`

This file takes an input string and converts it to its JavaScript unicode string equivilant.

```js
node src/unicode/get-raw-unicode.js abc
// \u0061\u0062\u0063

// app.js
const value = '\u0061\u0062\u0063';
value == 'abc' // true.

// correctly handles surrogate pairs
node src/unicode/get-raw-unicode.js 👌
// \uD83D\uDC4C

// app.js
const value = '\uD83D\uDC4C';
value == '👌' // true.
```