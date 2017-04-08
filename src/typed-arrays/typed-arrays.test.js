import { describe, it } from 'mocha';
import { expect } from 'chai';
import { add } from './typed-arrays';

// values can never be greater than 8 bits (0-255)
// always return enough space for an overflow byte

describe('typed arrays', () => {
  it('should add single digit values together', () => {
    const buffer1 = new ArrayBuffer(1);
    const view1 = new Uint8Array(buffer1);
    view1[0] = 1;
    const buffer2 = new ArrayBuffer(1);
    const view2 = new Uint8Array(buffer2);
    view2[0] = 1;

    const result = add(view1, view2);

    expect(result.length).to.equal(2);
    expect(result[0]).to.equal(0);
    expect(result[1]).to.equal(2);
  });

  it('should add single digit numbers together with overflow of digit less that 1 byte', () => {
    const buffer1 = new ArrayBuffer(1);
    const view1 = new Uint8Array(buffer1);
    view1[0] = 6;
    const buffer2 = new ArrayBuffer(1);
    const view2 = new Uint8Array(buffer2);
    view2[0] = 7;

    const result = add(view1, view2);

    expect(result.length).to.equal(2);
    expect(result[0]).to.equal(0);
    expect(result[1]).to.equal(13);
  });

  it('should overflow numbers greater than 1 byte', () => {
    const buffer1 = new ArrayBuffer(1);
    const view1 = new Uint8Array(buffer1);
    view1[0] = 255;
    const buffer2 = new ArrayBuffer(1);
    const view2 = new Uint8Array(buffer2);
    view2[0] = 100;

    const result = add(view1, view2);

    expect(result.length).to.equal(2);
    expect(result[0]).to.equal(1);
    expect(result[1]).to.equal(100);
  });
});