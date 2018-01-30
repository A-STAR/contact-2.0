import { ITreeNode } from '../../shared/components/flowtree/treenode/treenode.interface';

interface IResponseTreeNode {
  boxColor: string;
  children: IResponseTreeNode[];
  id: number;
  name: string;
  sortOrder: number;
}

const isEmpty = (array: any[]): boolean => !array || array.length === 0;

const convertToTreeNodes = (nodes: IResponseTreeNode[], table: boolean, expand: boolean) => {
  return nodes
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map(node => {
      const { children, sortOrder, ...data } = node;
      return {
        data,
        ...(!isEmpty(children) ? { children: convertToTreeNodes(children, table, expand) } : {}),
        ...(table ? {} : { label: node.name || `Node #${node.id}`, bgColor: node.boxColor }),
        sortOrder,
        id: node.id,
        expanded: expand && !isEmpty(children),
      };
    });
};

const addParents = (nodes: ITreeNode[], parent: ITreeNode = null): void => {
  // Because there are circular references in nodes, it is not possible to use spread operator here
  // (it would create new references)
  nodes.forEach(node => {
    node.parent = parent;
    if (node.children) {
      addParents(node.children, node);
    }
  });
};

export const toTreeNodes = (table: boolean = false, expand: boolean = false) => {
  return (nodes: IResponseTreeNode[]): ITreeNode[] => {
    const children = convertToTreeNodes(nodes, table, expand);
    const res = table ? children : [{ id: 0, children }];
    addParents(res);
    return res;
  };
};
