import { StateTree } from './state-tree';

describe('State tree', () => {
  let tree: StateTree;

  const treeToString = (data: any, indent: number = 0) => {
    const str = data.path[data.path.length - 1] !== 'root' ?
      new Array(indent + 1).join(' ') + data.path[data.path.length - 1] + '\n' : '';
    return str + (data.children && data.children.length ? data.children.map(c => treeToString(c, indent + 1)).join('') : '');
  };

  beforeEach(() => {
    tree =  new StateTree();
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

  it('should accept state convertion fn', () => {
    const options = {
      dataToState: data => data.state
    };
    const dataToState = spyOn(options, 'dataToState');
    const _tree = new StateTree(options);

    _tree.addNode(['test1'], { state: 333 });

    expect(dataToState).toBeCalledWith({ state: 333 });
  });

  it('should accept transform state fn', () => {
    const options = {
      transformState: (prev: number, next: number) => prev + next
    };
    const transformState = spyOn(options, 'transformState');
    const _tree = new StateTree(options);

    _tree.addNode(['test1'], 5);
    _tree.onChange(['test1'], 3);

    expect(transformState).toBeCalledWith(5, 3);
  });

});
