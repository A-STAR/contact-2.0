import { ITreeNode } from '../../shared/components/flowtree/treenode/treenode.interface';

import { isEmpty } from '.';

interface IResponseTreeNode {
  boxColor: string;
  children: IResponseTreeNode[];
  id: number;
  name: string;
  sortOrder: number;
}

const convertToTreeNodes = (nodes: IResponseTreeNode[], expand: boolean) => {
  return nodes
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map(node => {
      const { children, sortOrder, ...data } = node;
      return {
        data,
        ...(!isEmpty(children) ? { children: convertToTreeNodes(children, expand) } : {}),
        sortOrder,
        label: node.name || `Node #${node.id}`,
        bgColor: node.boxColor,
        id: node.id,
        expanded: expand && !isEmpty(node.children),
      };
    });
}

const addParents = (nodes: ITreeNode[], parent: ITreeNode = null) => {
  return nodes.map(node => {
    const { children } = node;
    return {
      ...node,
      ...(!isEmpty(children) ? { children: addParents(children, node) } : {}),
      parent,
    };
  });
}

export const toTreeNodes = (expand: boolean = false) => {
  return (nodes: IResponseTreeNode[]): ITreeNode[] => {
    return addParents([
      {
        id: 0,
        children: convertToTreeNodes(nodes, expand)
      }
    ]);
  }
}
