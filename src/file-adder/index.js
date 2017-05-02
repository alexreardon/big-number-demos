// @flow
import path from 'path';
import getReadFileStream from './get-read-file-stream';
import getWriteFileStream from './get-write-file-stream';

const input1$ = getReadFileStream(path.join(__dirname, 'input1'));
const input2$ = getReadFileStream(path.join(__dirname, 'input2'));
const output$ = getWriteFileStream(path.join(__dirname, 'output'));

const joinedInput$ = input1$.zip(input2$);

// could do something much more stream like here
let shouldCarry1 = false;

const add$ = joinedInput$.map(([value1: string, value2: string]): number => {
  const sum = Number(value1) + Number(value2) + (shouldCarry1 ? 1 : 0);
  shouldCarry1 = sum >= 10;
  return shouldCarry1 ? sum - 10 : sum;
});

const write$ = add$.map(value => {
  output$.next(value);
});

// start the stream
write$.subscribe({
  complete: () => {
    if (shouldCarry1) {
      output$.next(1);
    }
    output$.complete();
  },
});
