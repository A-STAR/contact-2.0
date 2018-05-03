import { range, deepFilterAndMap, IncId } from './general';

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

});
