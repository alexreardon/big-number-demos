Mechanisms for dealing with negative numbers:

1. sign and magnitude
first bit = sign (0 = positive, 1 = negative)

2. 1's complement
flip all the bits = the negative of that number

3. 2's complement
flip all the bits and add 1.
Same as 1's complement but does not have a +0 and -0

Subtraction

100 - 1

100
  1

Need to scan left until you can find a number you can borrow from.
This sucks - because we might need to borrow from a number that is not inside our buffer

So what about 2's complement?

100 - 1
is the same as
100 + -1

two's complement of 001 is
110 + 001 = 111

so our sum becomes

100 +
111

(1)011 (carry bit)
so 011
