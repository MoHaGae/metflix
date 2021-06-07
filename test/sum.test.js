const sum = (a, b) => a+b; 

const divide = (a, b) => a/b;

test('sum', () => {
    expect(sum(1,2)).toBe(3);
});

test('divide', ()=> {
    expect(divide(5,0)
    ).toBe(Infinity);
});

