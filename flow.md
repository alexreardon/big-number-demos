# Let's go big

## Intro

## Limitations of numbers in Javascript
- max value of `2^53 - 1`
- 64 bit floating point (IE2394??).
- biggest number you can store in 64 bits = `2^64`, but you loose some bits for things such as sign (and..?)

## What do we do with numbers?
- store values for viewing
- operations: what distingushes them from other data types


## Technique 1: decimal strings

100 => '100'

### Viewing
**key point**: easy - but takes space

- max value = `10^n - 1`
- n = max string length = 2^30 (ie9) `2^53 - 1` (es7)

split storage out?
- unicode, utf8 and utf16
- storage = 32 * 2^30 bits = 34,359,738,368 bits = 4.3 GB

### Operations
**key point**: you can achieve big operations by splitting them into parts

- long addition
- long subtraction
- multiplication (addition in a loop)
- division (subtraction in a loop)

## Techinque 2: binary ?? - might include for 2's complement
- as above but with base 2 (actually a smaller value)

## Techinque 3: hex
- as above but with base 16

## Techinque 4: utf8
- as above but with base utf8
- need to lean on previous explaination of *unicode*.

## Technique 5: single dimensional arrays

## Technique 6: two dimensional arrays

## Technique 7: n dimensional arrays

JavaScript on the GPU? - joke?

## Overcoming memory limitations

## Technique 1: increase the heap size of node
- limited by RAM
- increase the heap size of node
- simple, but limited approach

## Technique 2: files
use a file as an input stream
- viewing: just stream the file and read it out by chunks via a buffer
- operations: read in the files in pieces - do operation and save in pieces
- can even overcome OS limitations by storing in *multiple files*
- limited by disk space

## Technique 3: stream in - stream out (no storage)
- viewing: pipe one stream to another
- operations:

## Technique 4: distributed machines
number is too big to store on any one machine at a time
- stream into a buffer. This is then distributed out to machines as required. This can then be done in reverse to read the original number

operations can be done by:
- having two input streams and


# What about Uint32Array Uint64Array...

can create a buffer to just read one value at a time

https://github.com/tc39/proposal-integer
https://github.com/getify/You-Dont-Know-JS/blob/31e1d4ff600d88cc2ce243903ab8a3a9d15cce15/es6%20%26%20beyond/ch5.md#chapter-5-collections


