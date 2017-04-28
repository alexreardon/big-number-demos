# Let's go big

## What do we do with numbers?
- store values for viewing
- operations: what distinushes them from other data types

## What do we want big numbers for?

- do i need to go into this?

## Numbers in JavaScript
- 64 bit floating point (IEEE 754)
- max value of `2^53 - 1`
- *Mention Number.MAX_VALUE*?
- biggest number you can conceptually store is `2^64` but other bits are used for sign, mangitude (and by extension floating point)
- so you are left with maximum of 53 bits for a value: with the max value being `2^53 - 1`
- *TODO:* this is not unique to javascript: other languages share this number type

## What if I want to go bigger?

- Suprisingly large amount of techniques (some better than others)
- I will go through a few of them in detail.


## Starting easy: strings

Rather than storing our numbers as numbers - why not store them as strings?

## Strings in JavaScript

Unicode:
Just a list of number's to character (first 255 are the same as ASCII)
1,114,112 possible decimals
// 0x0 and 0x10FFFF

Encoding: representing those numbers in some binary format.
EG: ASCII, UTF-8, UTF-16, UTF-32 etc.

// https://mathiasbynens.be/notes/javascript-encoding

// Internally JavaScript can either use UCS-2 or UTF-16 to represent strings.

What the language exposes: 16 bit codepoints - which can be grouped together in 'surrogate pairs'. Each 16 bit chunk is what JavaScript uses as a character




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

## Strings 1: Decimals

### Values
- simple conversion from number: `10 => '10'`
- could also represent positive and negative values as well as decimals - but it decreases our range
- *show how max value is calculated*
- max value = `10^n - 1`
- n = max string length = 2^30 (ie9) `2^53 - 1` (es7)
- Compare difference with `Number.MAX_SAFE_INTEGER` *perhaps could use a scale graph*

### Operations

#### Addition

#### Subtraction
- point out that you might need to borrow from a long way away

#### Multiplication
- addition in a loop
,
#### Division
- subtraction in a loop

#### Comparision?
- equal to `===` (after normalisation)
- greater than = length and then just check down the digits
- can then create: greaterThanOrEqualTo, isLessThan, isLassThanOrEqualTo

**Key points**
- massive increase in value
- can still do operations - although subtraction kind of sucks

## Strings 2: binary
- smaller value 2^n -1
- but 2's complement makes doing subtraction really nice

## Strings 3: hex
- max value: `16^n - 1`

## Strings 4: unicode characters up to 16 bits
- *remind people why we cannot go above 16 bits*
- max value: `65,536^n - 1` `(2^16)^n - 1`

## Summary
- show differences between where we started and where we ended up

## Memory

### Strings

- String is `2^30` long.
- Each slot is `16 bits`.
- = 17,179,869,184 bits (`2.1474836480000001 bits` or  `2.1 GB`)

### Arrays

- for a flat array: each slot (`2^30 * 16`) * number of slots (`2^30`?) = `2305.843009 Peta byte's`
- gets out of control for the other ones

## How do we overcome these memory problems?
(other methods have similiar problems)


## Deprecated: Arrays of numbers

Array of unsigned 8 bit integers
Store values in order of magnitudue left to right.

Max length (`2^30` but should be `2^Number.MAX_SAFE_INTEGER`)
Max value of `2^(2^30 * 8)`

Easy to store and do operations on.
Hard to print a value. Need to reduce `2^30` binary into a value. Max value of numbers is `2^53 - 1` whereas for this structure is `2^(2^30 * 8)`. Therefore any total cannot be reduced into a single value.