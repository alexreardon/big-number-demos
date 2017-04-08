// @flow
import fs from 'fs';
import { Observable } from 'rxjs';

type Options = {
  highWaterMark: number,
  encoding: string,
}

const defaultOptions: Options = {
  // number of bits to read at a time
  highWaterMark: 1,
  encoding: 'utf8',
};

export default (path: string, options?: Options = defaultOptions) =>
  Observable.create((observer) => {
    const file$ = fs.createReadStream(path, options);

    file$.on('data', (chunk) => observer.next(chunk));
    file$.on('end', () => observer.complete());
    file$.on('close', () => observer.complete());
    file$.on('error', (error) => observer.error(error));

    // there seems to be no way to actually close the stream
    return () => file$.pause();
  });