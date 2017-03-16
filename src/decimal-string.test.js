// @flow
import { describe, it } from 'mocha';
import { expect } from 'chai';
import { add } from './decimal-string';

describe('decimal string', () => {
  describe('addition', () => {
    describe('single digits', () => {
      it('should add two numbers with no overflow', () => {
        expect(add('1', '2')).to.equal('3');
      });

      it('should add two numbers with overflow', () => {
        expect(add('6', '8')).to.equal('14');
      });
    });

    describe('two digitis', () => {
      it('should add two numbers with no overflow', () => {
        expect(add('24', '15')).to.equal('39');
      });

      it('should add two numbers with overflow in the 10s digit', () => {
        expect(add('15', '16')).to.equal('31');
      });

      it('should add two numbers with overflow in the 100s digit', () => {
        expect(add('50', '61')).to.equal('111');
      });

      it('should add two numbers with overflow in the 100s digit', () => {
        expect(add('50', '61')).to.equal('111');
      });

      it('should add two numbers with overflow in every digit', () => {
        expect(add('86', '86')).to.equal('172');
      });
    });

    describe('it should return null if the overflow is bigger than the max number size', () => {
      expect(add('50', '51')).to.equal(null);
    });
  });

  describe('subtraction', () => {

  });

  describe('multiplication', () => {

  });

  describe('division', () => {

  });
});