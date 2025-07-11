// Purpose of unit testing:
// Suppose developer accidently changes the + symbol to - and moved the code to production
// This may create impact in many critical use cases
// Unit testing helps us to avoid these kind of scenarios

function addNumber(num1: number, num2: number): number {
  return num1 + num2;
}

describe('AddNumber', () => {
  it('add 2 numbers and returns the result', () => {
    expect(addNumber(2, 2)).toEqual(4);
  });
});
