// @flow
import { describe, it } from 'mocha';
import { expect } from 'chai';
import { add, subtract, multiply, divide, isGreaterThan } from './decimal-string';

describe('decimal string', () => {
  describe('is greater than', () => {
    describe('single digits', () => {
      it('should return false when the values are equal', () => {
        expect(isGreaterThan('3', '3')).to.equal(false);
      });

      it('should return true when the first value is bigger than the second', () => {
        expect(isGreaterThan('5', '3')).to.equal(true);
      });

      it('should return false when the value is smaller than the second', () => {
        expect(isGreaterThan('2', '4')).to.equal(false);
      });
    });

    describe('double digitis against single digits', () => {
      it('should return true when the first value is bigger than the second', () => {
        expect(isGreaterThan('15', '3')).to.equal(true);
      });

      it('should return false when the value is smaller than the second', () => {
        expect(isGreaterThan('2', '14')).to.equal(false);
      });
    });

    describe('double digitis against double digits', () => {
      it('should return false when the values are equal', () => {
        expect(isGreaterThan('42', '42')).to.equal(false);
      });

      it('should return true when the first value is bigger than the second', () => {
        expect(isGreaterThan('87', '32')).to.equal(true);
      });

      it('should return false when the value is smaller than the second', () => {
        expect(isGreaterThan('29', '50')).to.equal(false);
      });
    });
  });

  describe('is greater than or equal to', () => {

  });
  describe('addition', () => {
    describe('term validation', () => {
      // for every item in an array, add a value that has a '-' prefix
      const withNegative = (array: string[]): string[] => array.concat(array.map(item => `-${item}`));

      const invalidTerms: string[] = withNegative(['abc', '10a', 'a10', '10.', '10.a', '10.0a', 'a10.4', '.1']);
      const validTerms: string[] = withNegative(['1', '10', '1.0', '1.1', '0.1', '10.001', '10.00']);

      it('should throw if the first term is invalid', () => {
        invalidTerms.forEach(arg => {
          expect(() => add(arg, '10')).to.throw();
        });
      });

      it('should throw if the second term is invalid', () => {
        invalidTerms.forEach(arg => {
          expect(() => add('10', arg)).to.throw();
        });
      });

      it('should not throw if the first term is valid', () => {
        validTerms.forEach(arg => {
          expect(() => add(arg, '10')).to.not.throw();
        });
      });

      it('should not throw if the second term is valid', () => {
        validTerms.forEach(arg => {
          expect(() => add('10', arg)).to.not.throw();
        });
      });
    });

    describe('single digits', () => {
      it('should add with no overflow', () => {
        expect(add('1', '2')).to.equal('3');
      });

      it('should add with overflow', () => {
        expect(add('6', '8')).to.equal('14');
      });
    });

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

    describe('decimals', () => {
      it('should add decimals', () => {
        expect(add('0.2', '0.1')).to.equal('0.3');
      });

      it('should add decimals with overflow', () => {
        expect(add('0.01', '0.02')).to.equal('0.03');
      });

      it('should add decimals with integer overflow', () => {
        expect(add('1.6', '1.6')).to.equal('3.2');
      });

      it('should add decimals with integer overflow and no remainder', () => {
        expect(add('0.5', '0.5')).to.equal('1');
      });

      it('should add a one digit decimal with a two digit decimal', () => {
        expect(add('0.2', '0.02')).to.equal('0.22');
      });

      it('should add two digit decimals with overflow', () => {
        expect(add('0.15', '0.16')).to.equal('0.31');
      });

      it('should add two digit decimals with overflow and no remainder in the second digit', () => {
        expect(add('0.15', '0.15')).to.equal('0.3');
      });

      it('should add two digit decimals with overflow and no decimal remainder', () => {
        expect(add('0.45', '0.55')).to.equal('1');
      });

      it('should add numbers with and without decimals', () => {
        expect(add('101', '1.2')).to.equal('102.2');
      });
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

    describe('tripple digits', () => {
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

    describe('decimals', () => {
      it('should subtract decimals', () => {
        expect(subtract('0.2', '0.1')).to.equal('0.1');
      });

      it('should subtract decimals with overflow', () => {
        expect(subtract('0.01', '0.02')).to.equal('-0.01');
      });

      it('should subtract decimals with integer overflow', () => {
        expect(subtract('10.6', '5.7')).to.equal('4.9');
      });

      it('should subtract decimals with integer overflow and no remainder', () => {
        expect(subtract('0.5', '0.5')).to.equal('0');
      });

      it('should subtract a one digit decimal with a two digit decimal', () => {
        expect(subtract('0.2', '0.02')).to.equal('0.18');
      });

      it('should subtract two digit decimals with overflow', () => {
        expect(subtract('0.16', '0.15')).to.equal('0.01');
      });

      it('should subtract two digit decimals with overflow and no remainder in the first digit', () => {
        expect(subtract('0.15', '0.05')).to.equal('0.1');
      });

      it('should subtract numbers with and without decimals', () => {
        expect(subtract('101', '1.2')).to.equal('99.8');
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
    it('should return 0 when anything mulitiplied by 0 is 0', () => {
      ['1', '12', '102', '101011'].forEach(value => {
        expect(multiply(value, '0')).to.equal('0');
      });
    });

    it('should return the original value when mutliplied by 1', () => {
      ['1', '12', '102', '101011'].forEach(value => {
        expect(multiply(value, '1')).to.equal(value);
      });
    });

    describe('single digits', () => {
      it('should multiply with no overflow', () => {
        expect(multiply('2', '4')).to.equal('8');
      });

      it('should multiply with overflow', () => {
        expect(multiply('4', '4')).to.equal('16');
      });
    });

    describe('double digits', () => {
      it('should multiply with a single digit', () => {
        expect(multiply('10', '5')).to.equal('50');
      });

      it('should multiply with one overflow', () => {
        expect(multiply('10', '10')).to.equal('100');
      });

      it('should multiply with lots of overflow', () => {
        expect(multiply('99', '99')).to.equal('9801');
      });
    });

    describe('tripple digits', () => {
      it('should multiply with single digits', () => {
        expect(multiply('100', '5')).to.equal('500');
      });

      it('should multiply with double digits and one overflow', () => {
        expect(multiply('100', '10')).to.equal('1000');
      });

      it('should multiply with double digits and two overflow digits', () => {
        expect(multiply('500', '20')).to.equal('10000');
      });

      it('should multiply with double digits with maximum overflow', () => {
        expect(multiply('999', '99')).to.equal('98901');
      });

      it('should mulitply with tripple digits', () => {
        expect(multiply('100', '100')).to.equal('10000');
      });

      it('sould multiple with maxium overflow', () => {
        expect(multiply('999', '999')).to.equal('998001');
      });
    });

    describe('decimals', () => {

    });
  });

  describe('division', () => {
    it('should return null when anything is divided by zero', () => {
      ['1', '12', '102', '101011'].forEach(value => {
        expect(divide(value, '0')).to.equal(null);
      });
    });

    it('should return the original value when it is divided by one', () => {
      ['1', '12', '102', '101011'].forEach(value => {
        expect(divide(value, '1')).to.equal(value);
      });
    });

    describe('single digits', () => {
      it('should divide with factors', () => {
        expect(divide('6', '2')).to.equal('3');
      });

      it('should divide with simple remainders', () => {
        expect(divide('3', '2')).to.equal('1 + 1/2');
      });

      it('should divide with simple remainders - with decimals being factors', () => {
        expect(divide('6', '4')).to.equal('1 + 2/4');
      });

      it('should divide with harder remainders', () => {
        expect(divide('7', '6')).to.equal('1 + 1/6');
      });
    });

    describe('double digits', () => {
      it('should divide with single digit factors', () => {
        expect(divide('20', '5')).to.equal('4');
      });

      it('should divide with single digits and remainders', () => {
        expect(divide('82', '5')).to.equal('16 + 2/5');
      });

      it('should divide with double digit factors', () => {
        expect(divide('20', '10')).to.equal('2');
      });
    });
  });
});