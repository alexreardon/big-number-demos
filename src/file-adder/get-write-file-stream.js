// @flow
import fs from 'fs';
import { Observable, Subject } from 'rxjs';

type Options = {
  highWaterMark: number,
  encoding: string,
}

const defaultOptions: Options = {
  // number of bits to read at a time
  highWaterMark: 1,
  encoding: 'utf8',
};

export default (path: string, options?: Options = defaultOptions) => {
  const write$ = fs.createWriteStream(path, options);

  const output$ = new Subject();

  // is there a better way to do this?
  output$.subscribe({
    next: (value) => {
      console.log('about to write value to file', value);
      write$.write(`${value}`);
    },
  });

  return output$;
};