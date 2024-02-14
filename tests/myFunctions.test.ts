test('basic', () => {
    expect(0+0).toBe(0);
  });
  
  test('basic again', () => {
    expect(1+2).toBe(3);
  });
  
  describe('some text', () => {
      it('my test', () => {
          expect(1+2).toBe(3);
      })
  });