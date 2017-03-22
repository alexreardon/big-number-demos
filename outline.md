# Let's go big


Do you feel stifled, limited, like you are unable to grow? Try to imagine how numbers in JavaScript feel - they are stuck between +/- 9007199254740991. Unable to breathe, they are stuck. I will talk about how we can free numbers in JavaScript to represent values much larger than its natural constraints. The talk will navigate through increasingly creative techniques, each building on the previous one, to represent numbers of ever increasing values - freeing numbers from their constraints as well as ourselves.

```js
const max = Math.pow(2, 53) - 1;
max == 9007199254740991;
Number.MAX_SAFE_INTEGER ==  9007199254740991;
Number.MIN_SAFE_INTEGER == -9007199254740991;
String(9007199254740991).length == 16; // can only represent up to 16 digits!
```
`9007199254740991` just over 9 quadrillion
`1000000000000000` ~ 9 * 10^15

numbers are 64bit floating point
components: (TODO: get correct names)
- scale
- integer
- decimal

Also - some operations can only occur on 32bit numbers

```js
const max = Math.pow(2,31) - 1;
max == 2147483647
```

`2147483647` only 2 billion
`1000000000` 10^9


## Technique x?: multiple numbers

```js
const numbers = [200, 100]; ~200100

// print
numbers.join('');
```

# operations
at some point you will need to trade size for speed
show how to do basic operations (+-*/)
don't do all of them - but mathmatically it is possible - use a few examples

## Technique 1: strings

### 1.1 Base 10 strings
```js
const value = '1000000000000000000000000...';
```

**Length of value increase**
What is the max length of a string?
IE9: `2^30`
ES7: `(2^53)-1` (http://www.ecma-international.org/ecma-262/7.0/index.html#sec-ecmascript-language-types-string-type)

number slots: `2^4` digits = 16
string slots: `2^30` digits = 1073741824 ~1 billion

*todo: memory usage*

**Scale increase**
`2^4` => `2^30` == `2^26` larger

ideas:
- another string for decimals
- a variable for sign
- operations

### 1.2 binary strings
'00010101' (it is right to left)
1 + 0 + 4 + 0 + 16 = 21

`2^30` of binary digits
= max size of `2^(2^30) -1`

### 1.3 hex strings (base 16 digits)
rather than just `0` or `1` you can store `/[0-9a-f]/` == `0-15` in one digit (base 16)

### 1.4 utf16 digit strings (or is it utf8?)
lol: (cannot use double byte character - only 1 byte charaters)


## Technique 2: arrays

Allow the storing of multiple values in the same structure
note: cannot join strings as it will exceed the max string length

### 1.1 One dimensional array

### 1.1.1 numbers
`[100, 200]`
operations = hard

#### 1.1.1 base 10 strings
['9', '1', '1'] = 911
['900', '111'] = 900111

#### 1.1.2 binary strings
['0', '1', '0']
['01010101010101010', '10000010101']

#### 1.1.3 utf8 strings

### 1.2 Two dimensional array

### 1.3 n dimensional array
(diagram would be awesome)

## Techinque: alternative notations

### 3.1 scientific notation
### 3.2 binary notation (2^42)

## Technique: distributed calculations

leveraging larger pools of memory
ideas:
- printer
- multiple computers / cloud instances /w buffered display and manipulation

need to solve:
- displaying large numbers
- calculations

### Storage
Stream a large number to a node. When it is full, move onto the next node

1. initial contact with node
2. ask if you can send a value
3. send buffer (if needed)
4. can I send another?
5. if yes: goto 3, if no: goto 6
6. move to next node. while there are more nodes and number is still going: go to 2. Otherwise goto 7
7. finish

### Reading:
stream everything from each node - one at a time

### Operations - addition
techniques:
- store the whole string then ask nodes to add them (double the memory)
- stream the number in and get the node to update the value in place. the node would need to return any digits that need to be carried





