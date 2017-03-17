// @flow
import { describe, it } from 'mocha';
import { expect } from 'chai';
import { add, subtract } from './decimal-string';

describe('decimal string', () => {
  describe('addition', () => {
    describe('single digits', () => {
      it('should add with no overflow', () => {
        expect(add('1', '2')).to.equal('3');
      });

      it('should add with overflow', () => {
        expect(add('6', '8')).to.equal('14');
      });
    });

    // TODO: adding positive and negative numbers

    describe('two digitis', () => {
      it('should add with one digit numbers', () => {
        expect(add('10', '2')).to.equal('12');
      });

      it('should add with one digit numbers with overflow', () => {
        expect(add('15', '6')).to.equal('21');
      });

      it('should add with no overflow', () => {
        expect(add('24', '15')).to.equal('39');
      });

      it('should add with overflow in the first digit', () => {
        expect(add('15', '16')).to.equal('31');
      });

      it('should add with overflow in the second digit', () => {
        expect(add('50', '61')).to.equal('111');
      });

      it('should add with overflow in every digit', () => {
        expect(add('99', '99')).to.equal('198');
      });
    });

    describe('three digits', () => {
      it('should add with overflow in first digit', () => {
        expect(add('102', '9')).to.equal('111');
      });

      it('should add with overflow in second digit', () => {
        expect(add('120', '81')).to.equal('201');
      });

      it('should add with overflow in the first digit causing overflow in the second digit', () => {
        expect(add('154', '57')).to.equal('211');
      });

      it('should add with overflow in the first and second digit', () => {
        expect(add('199', '99')).to.equal('298');
      });

      it('should add with overflow in every digit', () => {
        expect(add('999', '999')).to.equal('1998');
      });
    });

    describe.skip('decimals', () => {

    });

    describe('it should return null if the overflow is bigger than the max number size', () => {
      it('should return null when exceeding the maximum allowable length', () => {
        expect(add('20', '20', { maxLength: 2 })).to.equal('40');
        expect(add('50', '51', { maxLength: 2 })).to.equal(null);
      });
    });

    describe('breaking through Number.MAX_SAFE_INTEGER', () => {
      it('should be able to deal with numbers greater than Number.MAX_SAFE_INTEGER', () => {
        // regular numbers fail
        expect(`${9007199254740991 + 2}`).to.not.equal('9007199254740993');

        // this method succeeds
        expect(add('9007199254740991', '2')).to.equal('9007199254740993');
      });
    });
  });

  describe('subtraction', () => {
    it('should return 0 if the digits are the same', () => {
      expect(subtract('1', '1')).to.equal('0');
      expect(subtract('22', '22')).to.equal('0');
      expect(subtract('333', '333')).to.equal('0');
    });

    describe('single digits', () => {
      it('should subtract with no overflow', () => {
        expect(subtract('2', '1')).to.equal('1');
      });

      it('should subtract going from positive to negative', () => {
        expect(subtract('2', '3')).to.equal('-1');
      });
    });

    describe('double digits', () => {
      it('should subtract one digit numbers', () => {
        expect(subtract('16', '5')).to.equal('11');
      });

      it('should subtract one digit numbers with overflow', () => {
        expect(subtract('10', '5')).to.equal('5');
      });

      it('should subtract two digit numbers', () => {
         expect(subtract('22', '11')).to.equal('11');
      });

      it('should subtract two digit numbers with overflow in the first digit', () => {
         expect(subtract('22', '13')).to.equal('9');
      });

      it('should subtract two digit numbers with overflow in the second digit', () => {
         expect(subtract('22', '30')).to.equal('-8');
      });

      it('should subtract two digit numbers with overflow in every digit', () => {
         expect(subtract('11', '22')).to.equal('-11');
      });
    });

    describe('trippled digits', () => {
      it('should subtract one digit numbers', () => {
        expect(subtract('101', '1')).to.equal('100');
      });

      it('should subtract one digit numbers with overflow', () => {
        expect(subtract('100', '1')).to.equal('99');
      });

      it('should subtract two digit numbers', () => {
        expect(subtract('111', '11')).to.equal('100');
      });

      it('should subtract two digit numbers with overflow in the first digit', () => {
        expect(subtract('121', '12')).to.equal('109');
      });

      it('should subtract two digit numbers with overflow in every digit', () => {
        expect(subtract('100', '99')).to.equal('1');
      });

      it('should subtract three digit numbers', () => {
        expect(subtract('222', '111')).to.equal('111');
      });

      it('should subtract three digit numbers with overflow in the first digit', () => {
        expect(subtract('212', '103')).to.equal('109');
      });

      it('should subtract three digit numbers with overflow in the second digit', () => {
        expect(subtract('501', '111')).to.equal('390');
      });

      it('should subtract three digit numbers with overflow in the first two second digits', () => {
        expect(subtract('500', '111')).to.equal('389');
      });

      it('should subtract three digit numbers with overflow in every digit', () => {
        expect(subtract('111', '999')).to.equal('-888');
      });
    });

    // describe('it should return null if the overflow is bigger than the max number size', () => {
    //   it('should return null when exceeding the maximum allowable length', () => {
    //     expect(add('20', '20', { maxLength: 2 })).to.equal('40');
    //     expect(add('50', '51', { maxLength: 2 })).to.equal(null);
    //   });
    // });

    describe('breaking through Number.MIN_SAFE_INTEGER', () => {
      it('should be able to deal with numbers smaller than Number.MIN_SAFE_INTEGER', () => {
        // regular numbers fail
        expect(`${-9007199254740991 - 2}`).to.not.equal('-9007199254740993');

        // this method succeeds
        expect(subtract('0', '9007199254740993')).to.equal('-9007199254740993');
      });
    });
  });

  describe('multiplication', () => {

  });

  describe('division', () => {

  });
});