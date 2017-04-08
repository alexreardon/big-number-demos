# Let's go big

## What do we do with numbers?
- store values for viewing
- operations: what distinushes them from other data types

## What do we want big numbers for?

- do i need to go into this?

## Numbers in JavaScript
- 64 bit floating point (IEEE 754)
- max value of `2^53 - 1`
- biggest number you can conceptually store is `2^64` but other bits are used for sign, mangitude (and by extension floating point)
- so you are left with maximum of 53 bits for a value: with the max value being `2^53 - 1`
- *TODO:* this is not unique to javascript: other languages share this number type

**What if I want to go bigger?**

## Arrays of numbers

Array of unsigned 8 bit integers
Store values in order of magnitudue left to right.

Max length (`2^30` but should be `2^Number.MAX_SAFE_INTEGER`)
Max value of `2^(2^30 * 8)`

Easy to store and do operations on.
Hard to print a value. Need to reduce `2^30` binary into a value. Max value of numbers is `2^53 - 1` whereas for this structure is `2^(2^30 * 8)`. Therefore any total cannot be reduced into a single value.

## Starting easy: strings

Rather than storing our numbers as numbers - why not store them as strings?

## Strings in JavaScript

Unicode:
Just a list of number's to character (first 255 are the same as ASCII)
1,114,112 possible values
0x0 and 0x10FFFF
JavaScript stores strings in UTF-16 (1 - 2 blocks of 16 bits)


legacy: U+0000 - U+FFFF + unions
es6: \u{hex}

```js
const getCharCodes = str => str
  .split('')
  .map((char, index) => str.charCodeAt(index))
  .join(', ');
```

"h": 104
"e": 101
"l": 108
"l": 108
"0": 111
" ": 32
"😀": 55,357 + 56,832 (suggorate pair)

can also go the other way

```js
const getText = (numbers) =>
  numbers
    .map(number => String.fromCodePoint(number))
    .join(', ');
```

104, 101, 108, 108, 111, 32, 55357 =>
hello 😀

String values in JavaScript are stored in UTF-16
Shorthand for unicode is \u{16 bit - 4 hex characters}

each hex digit represents a nibble (4bits)

"h": \u0068
"e": 101
"l": 108
"l": 108
"0": 111
" ": 32
"😀": 55357
