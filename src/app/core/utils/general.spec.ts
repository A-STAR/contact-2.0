import { range, deepFilterAndMap } from './general';

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

});
