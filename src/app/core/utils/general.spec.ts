import {
  range,
  deepFilterAndMap,
  IncId,
  binaryFromArray,
  toBoolArray,
  toBoolSizedArray,
  pickExisting,
  mergeDeep,
  mergeArray,
  mergeObject,
} from './general';

describe('General helper:', () => {

  describe('range', () => {
    it('should produce values', () => {
      expect(range(1, 10)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    });
  });

  describe('deepFilterAndMap', () => {

    const generateMocks = (deepCount: number, template: (index: number) => any) => {
      if (!deepCount--) { return; }
      return range(1, 10).map(i => ({
        ...template(i),
        ...(deepCount ? { children: generateMocks(deepCount, template) } : {} )
      }));
    };


    it('should get correct values with string keys', () => {
      let mockData;
      mockData = generateMocks(1, i => ({
          code: i,
          name: 'test',
          mandatory: Boolean(i % 2)
        })
      );
      let result = deepFilterAndMap<any, number>(mockData, 'mandatory', 'code');
      expect(result.length).toBe(5);

      mockData = generateMocks(2, i => ({
          code: i,
          name: 'test',
          mandatory: Boolean(i % 2)
        })
      );
      result = deepFilterAndMap<any, number>(mockData, 'mandatory', 'code');
      expect(result.length).toBe(50);
    });

    it('should get correct values with getters', () => {
      let mockData;
      mockData = generateMocks(1, i => ({
          code: i,
          name: 'test',
          mandatory: Boolean(i % 2),
          isDisabled: Boolean(i % 3)
        })
      );
      let result = deepFilterAndMap<any, number>(mockData,
          item => item.mandatory && !item.isDisabled,
          item => `${item.name}.${item.code}`);

       expect(result.length).toBe(2);
       expect(result).toEqual([
         'test.3',
         'test.9'
       ]);

      mockData = generateMocks(3, i => ({
          code: i,
          name: 'test',
          mandatory: Boolean(i % 2),
          isDisabled: Boolean(i % 3)
        })
      );
      result = deepFilterAndMap<any, number>(mockData,
          item => item.mandatory && !item.isDisabled,
          item => `${item.name}.${item.code}`);
      expect(result.length).toBe(200);
      expect(result[0]).toEqual('test.3');
    });

    it('should handle empty children', () => {
      const mockData = [
        {
          test: 1,
          children: []
        },
        {
          test: 2,
          mandatory: true,
        }
      ];
      expect(deepFilterAndMap(mockData, 'mandatory', 'test')).toEqual([ 2 ]);
    });

  });

  describe('incId', () => {
    let incId: IncId;

    beforeEach(() => {
      if (incId) {
        incId.uuid = 0;
      }
      incId = IncId.get();
    });

    it('should increment ids', () => {
      expect(incId.uuid).toEqual(1);
      expect(incId.uuid).toEqual(2);
      expect(incId.uuid).toEqual(3);
      expect(incId.uuid).toEqual(4);
    });

    it('should be singletone', () => {
      expect(incId.uuid).toEqual(1);
      expect(incId.uuid).toEqual(2);

      let incIdInstance = IncId.get();

      expect(incIdInstance.uuid).toEqual(3);
      expect(incIdInstance.uuid).toEqual(4);

      incIdInstance = IncId.get();
      incIdInstance.uuid = 66;

      expect(incIdInstance.uuid).toEqual(67);
      expect(incIdInstance.uuid).toEqual(68);
      expect(incId.uuid).toEqual(69);
    });

    it('should contain only positive values', () => {
      incId.uuid = -999;
      expect(incId.is(999)).toBeTruthy();
      expect(incId.uuid).toBe(1000);

      const _incId = IncId.get();

      _incId.uuid = -45;

      expect(_incId.is(45)).toBeTruthy();
    });
  });

  describe('binaryFromArray', () => {
    it('should return single binary value from passed array of booleans', () => {
      let result = binaryFromArray([true, false]);
      expect(result).toBe(2);

      result = binaryFromArray([]);
      expect(result).toBe(0);
      result = binaryFromArray([false]);
      expect(result).toBe(0);

      result = binaryFromArray([true]);
      expect(result).toBe(1);

      result = binaryFromArray([false, true]);
      expect(result).toBe(1);

      result = binaryFromArray([false, true, true, true, false]);
      expect(result).toBe(14);

      result = binaryFromArray([undefined, true, undefined, true, null]);
      expect(result).toBe(10);

    });
  });

  describe('toBoolArray', () => {
    it('should produce array of booleans from passed binary number', () => {

      let result = toBoolArray(1);
      expect(result).toEqual([true]);

      result = toBoolArray(0);

      expect(result).toEqual([false]);

      result = toBoolArray(undefined);

      expect(result).toEqual([false]);

      result = toBoolArray(3);
      expect(result).toEqual([true, true]);

      result = toBoolArray(5);
      expect(result).toEqual([true, false, true]);

      result = toBoolArray(-5);
      expect(result).toEqual([true, false, true]);

    });
  });

  describe('toBoolSizedArray', () => {
    it('should produce array of booleans of fixed size from passed binary number', () => {
      let result = toBoolSizedArray(1, 1);
      expect(result).toEqual([true]);

      result = toBoolSizedArray(0);

      expect(result).toEqual([false]);

      result = toBoolSizedArray(undefined);

      expect(result).toEqual([false]);

      result = toBoolSizedArray(3, 3);
      expect(result).toEqual([false, true, true]);

      result = toBoolSizedArray(5, 5);
      expect(result).toEqual([false, false, true, false, true]);

      result = toBoolSizedArray(-5, 5);
      expect(result).toEqual([false, false, true, false, true]);
    });
  });

  describe('pickExisting', () => {
    it('should return partial copy of an object with existing props', () => {
      let obj = pickExisting({});
      expect(obj).toEqual({});

      obj = pickExisting({ a: 1, b: null });
      expect(obj).toEqual({ a: 1 });

      obj = pickExisting({ a: 1, b: 0 });
      expect(obj).toEqual({ a: 1, b: 0 });

      obj = pickExisting({ a: 1, b: '' });
      expect(obj).toEqual({ a: 1, b: '' });

      obj = pickExisting({ a: 1, b: undefined });
      expect(obj).toEqual({ a: 1 });

      obj = pickExisting({ a: 1, b: false });
      expect(obj).toEqual({ a: 1 });

      obj = pickExisting(5);
      expect(obj).toEqual(5);

      obj = pickExisting(null);
      expect(obj).toEqual(null);

    });
  });

  describe('mergeObject', () => {
    it('should merge plain objects', () => {
      const dst = { a: 1, b: 1, d: 1 };
      const src = { a: 2, b: 2, c: 1 };
      expect(mergeObject(dst, src)).toEqual( { a: 2, b: 2, c: 1, d: 1 } );
    });

    it('should merge nested objects', () => {
      const dst = { a: 1, b: 1, c: { d: 1, e: 1 }, d: 1 };
      const src = { a: 2, b: 2, c: { d: 2, f: 1 }, d: { a: 1, b: { a: 1 } } };
      expect(mergeObject(dst, src)).toEqual( { a: 2, b: 2, c: { d: 2, e: 1, f: 1 }, d: { a: 1, b: { a: 1 } } } );
    });
  });

  describe('mergeArray', () => {
    it('should merge plain arrays', () => {
      const dst = [ 1, 2, 'test' ];
      const src = [ 4, 2, 'test', 'test1' ];
      expect(mergeArray(dst, src)).toEqual( [ 1, 2, 'test', 4, 'test1' ] );
    });

    it('should merge arrays with nested objects', () => {
      const dst = [ 1, 2, 'test', { a: 1 } ];
      const src = [ 4, 2, 'test', { a: 2, b: 1 }, 'test1' ];
      expect(mergeArray(dst, src)).toEqual( [ 1, 2, 'test', { a: 2, b: 1 }, 4, 'test1' ] );
    });

    it('should merge nested arrays', () => {
      const dst = [ [ 1, 2 ], { a: [1, 2] } ];
      const src = [ [ 3, 2, 4], { a: [ 3, 2, 4 ], b: 1 } ];
      expect(mergeArray(dst, src)).toEqual( [ [ 1, 2, 3, 4 ], { a: [ 1, 2, 3, 4 ], b: 1 } ] );
    });
  });

  describe('mergeDeep', () => {

    it('should handle non mergeable arguments', () => {
      let dst = { a: 1 } as any;
      let src = 4 as any;
      expect(mergeDeep(dst, src)).toEqual( dst );
      src = undefined;
      expect(mergeDeep(dst, src)).toEqual( dst );
      dst = 4;
      src = { b: 1 };
      expect(mergeDeep(dst, src)).toEqual( { b: 1 } );
      dst = undefined;
      src = null;
      expect(mergeDeep(dst, src)).toEqual( {} );
      dst = undefined;
      src = { a: [ 1, 2, 3 ] };
      expect(mergeDeep(dst, src)).toEqual( {  a: [ 1, 2, 3 ] } );
    });

    it('should merge objects with nested arrays', () => {
      const dst = { a: 1, b: [ { a: 1 }, { b: 2 } ], c: { d: [1, 2] } };
      const src = { a: 2, b: [ { a: 1 }, { b: 2 }, { c: 3 } ], c: { d: [1, 3] } };
      expect(mergeDeep(dst, src)).toEqual( { a: 2, b: [ { a: 1 }, { b: 2 }, { c: 3 } ], c: { d: [ 1, 2, 3 ] } } );
    });

    it('should change nested objects reference', () => {
      const dst = { a: { b: { c: 1 } } };
      const result = mergeDeep(dst, dst);
      expect( result.a.b.c ).toBe( dst.a.b.c );
      expect( result.a ).not.toBe( dst.a );
      expect( result.a.b ).not.toBe( dst.a.b );
    });

    it('should change nested arrays reference', () => {
      const dst = { a: { b: [ 1 ] } };
      const result = mergeDeep(dst, dst);
      expect( result.a.b[0] ).toBe( dst.a.b[0] );
      expect( result.a.b ).not.toBe( dst.a.b );
    });

    it('should copy non plain objects by reference', () => {
      class MyClass { test = 'a'; }
      const refObj = new MyClass();
      const dst = { a: refObj, b: { c: refObj } };

      const result = mergeDeep(dst, dst);
      expect(result.a).toBe(refObj);
      expect(result.b.c).toBe(refObj);
    });

  });

});
