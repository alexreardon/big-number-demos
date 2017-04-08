// @flow
import { describe, it } from 'mocha';
import { expect } from 'chai';
import { add } from './number-array';

describe('number array', () => {
  describe('addition', () => {
    it('should add single numbers', () => {
      expect(add([1], [2])).to.deep.equal([3]);
    });

    it('should add two digit numbers', () => {
      // 12 + 11
      expect(add([1, 2], [1, 1])).to.deep.equal([2, 3]);
    });

    it('should add a single and double digit numbers', () => {
      // 12 + 11
      expect(add([1, 2], [1])).to.deep.equal([1, 3]);
    });

    it('should carry single digit additions', () => {
      expect(add([5], [6])).to.deep.equal([1, 1]);
    });

    it('should carry two digit numbers in the first digit', () => {
      expect(add([15], [16])).to.deep.equal([2, 1]);
    });

    it('should carry two digit numbers in the second digit', () => {
      expect(add([51], [52])).to.deep.equal([1, 0, 3]);
    });
  });
});