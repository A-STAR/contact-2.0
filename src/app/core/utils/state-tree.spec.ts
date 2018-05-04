import { StateTree } from './state-tree';

describe('State tree', () => {
  let tree: StateTree;

  const treeToString = (data: any, indent: number = 0) => {
    const str = data.path[data.path.length - 1] !== 'root' ?
      new Array(indent + 1).join(' ') + data.path[data.path.length - 1] + '\n' : '';
    return str + (data.children && data.children.length ? data.children.map(c => treeToString(c, indent + 1)).join('') : '');
  };

  beforeEach(() => {
    tree =  new StateTree({
      mask: [],
      dataKeys: [],
      dataToState: data => Number(data)
    });
  });

  it('should add nodes', () => {
    const testData = {
      path: ['root'],
      children: [
        {
          path: ['root', 'test1'],
          children: [
            {
              path: ['root', 'test1', 'test2'],
              children: [
                {
                  path: ['root', 'test1', 'test2', 'test3']
                }
              ]
            },
            {
              path: [ 'root', 'test1', 'test4' ],
            },
            {
              path: [ 'root', 'test1', 'test5' ],
            },
          ],
        }
      ],
    };

    tree.addNode(['test1'], 1);
    tree.addNode(['test1', 'test2'], 0);
    tree.addNode(['test1', 'test2', 'test3'], 0);
    tree.addNode(['test1', 'test4'], 0);
    tree.addNode(['test1', 'test5'], 0);

    expect(tree.toString()).toEqual(treeToString(testData));
  });

  it('should add deep nested nodes', () => {
    const testData = {
      path: ['root'],
      children: [
        {
          path: ['root', 'test1'],
          children: [
            {
              path: ['root', 'test1', 'test2'],
              children: [
                {
                  path: ['root', 'test1', 'test2', 'test3']
                }
              ]
            },
            {
              path: [ 'root', 'test1', 'test4' ],
            },
            {
              path: [ 'root', 'test1', 'test5' ],
            },
          ],
        }
      ],
    };

    tree.addNode(['test1', 'test2', 'test3'], 0);
    tree.addNode(['test1', 'test4'], 0);
    tree.addNode(['test1', 'test5'], 0);

    expect(tree.toString()).toEqual(treeToString(testData));

  });

  it('should find node', () => {

    tree.addNode(['test1'], 1);
    tree.addNode(['test1', 'test2'], 42);
    tree.addNode(['test1', 'test2', 'test3'], 33);
    tree.addNode(['test1', 'test2', 'test3', 'test6'], 66);
    tree.addNode(['test1', 'test2', 'test3', 'test7'], 67);
    tree.addNode(['test1', 'test2', 'test4'], 11);
    tree.addNode(['test1', 'test5'], 9);

    expect(tree.findNode(['test1', 'test2']).currentState).toBe(42);
    expect(tree.findNode(['test1', 'test2', 'test3']).currentState).toBe(33);
    expect(tree.findNode(['test1', 'test2', 'test3', 'test7']).currentState).toBe(67);
    expect(tree.findNode(['test1', 'test2', 'test4']).currentState).toBe(11);
    expect(tree.findNode(['test1', 'test5']).currentState).toBe(9);

    expect(tree.findNode(['adsadsad', 'sfsewrewrdfsf'])).toBeUndefined();

  });

  it('should update node value if node already exists', () => {
    tree.addNode(['test1', 'test2', 'test3'], 2);
    const node = tree.findNode(['test1', 'test2', 'test3']);
    const childrenNumber = node.parent.children.length;
    expect(node.currentState).toBe(2);

    tree.addNode(['test1', 'test2', 'test3'], 3);
    const newNode = tree.findNode(['test1', 'test2', 'test3']);
    expect(newNode.currentState).toBe(3);
    expect(childrenNumber).toBe(newNode.parent.children.length);
  });

  it('should accept state convertion fn', () => {
    const options = {
      dataToState: data => data.state,
      mask: [],
      dataKeys: [ 'state' ]
    };
    const dataToState = spyOn(options, 'dataToState').and.returnValue(1);
    const _tree = new StateTree(options);

    _tree.addNode(['test1'], { state: 1 });
    expect(dataToState).toBeCalledWith({ state: 1 });
  });

  it('should throw specific error when no params are passed', () => {
    const options = undefined;
    expect(() => new StateTree(options as any)).toThrowError('Params for state tree not found!');
  });

  it('should throw specific error when no mask is passed', () => {
    const options = {
      dataKeys: []
    };
    expect(() => new StateTree(options as any)).toThrowError('Rule mask for state tree not found!');
  });

  it('should throw specific error when no dataKeys is passed', () => {
    const options = {
      mask: []
    };
    expect(() => new StateTree(options as any)).toThrowError('Data keys for state tree not found!');
  });

  it('should transform state according to mask', () => {
    const options = {
      mask: [[ 1, 2, 3 ], [3, 8, 2]],
      dataKeys: [1, 2, 3],
      dataToState: data => Number(data)
    };
    const _tree = new StateTree(options);
    _tree.addNode(['test1'], 1);
    const node = _tree.findNode(['test1']);

    expect(node.currentState).toBe(1);
    _tree.onChange(['test1'], 2);

    expect(node.currentState).toBe(3);
    _tree.onChange(['test1'], 8);

    expect(node.currentState).toBe(2);

    _tree.onChange(['test1'], 115);
    expect(node.currentState).toBe(115);
  });

  it('should convert data to state', () => {
    const options = {
      mask: [],
      dataKeys: ['myKeyOne', 'myKeyTwo'],
    };
    const _tree = new StateTree(options);
    _tree.addNode(['test1'], { myKeyOne: true, myKeyTwo: false });
    const node = _tree.findNode(['test1']);
    expect(node.currentState).toBe(2);

    _tree.onChange(['test1'], { myKeyOne: false, myKeyTwo: true });

    expect(node.currentState).toBe(1);
  });

  it('should return converted data of added node', () => {
    const options = {
      mask: [[ 1, 2, 3 ], [3, 8, 2]],
      dataKeys: ['keyOne', 'keyTwo', 'keyThree'],
    };
    const _tree = new StateTree(options);
    const firstNodeData = _tree.addNode(['test1'], { keyOne: true, keyTwo: false, keyThree: false });
    const secondNodeData = _tree.addNode(['test1', 'test2'], { keyOne: false, keyTwo: true, keyThree: false });
    expect(firstNodeData).toEqual({ keyOne: true, keyTwo: false, keyThree: false });
    expect(secondNodeData).toEqual({ keyOne: false, keyTwo: true, keyThree: false });
  });

  it('should return data keys with the new state', () => {
    const options = {
      mask: [[ 1, 3, 1 ]],
      dataKeys: ['myKeyOne', 'myKeyTwo']
    };
    const _tree = new StateTree(options);
    _tree.addNode(['test1'], { myKeyOne: false, myKeyTwo: true });
    const node = _tree.findNode(['test1']);
    expect(node.currentState).toBe(1);

    let result = _tree.onChange(['test1'], { myKeyOne: true, myKeyTwo: true });

    expect(result).toEqual({
      myKeyOne: false,
      myKeyTwo: true,
    });

    expect(node.currentState).toBe(1);

    result = _tree.onChange(['test1'], { myKeyOne: true, myKeyTwo: false });

    expect(node.currentState).toBe(2);

    expect(result).toEqual({
      myKeyOne: true,
      myKeyTwo: false,
    });

  });

});
