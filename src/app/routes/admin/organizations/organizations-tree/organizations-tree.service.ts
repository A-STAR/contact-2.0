import { Injectable } from '@angular/core';
import * as R from 'ramda';

import { ITreeNode } from '../../../../shared/components/flowtree/treenode/treenode.interface';
import { ITreeNodeValue } from './organizations-tree.interface';

@Injectable()
export class OrganizationsTreeService {

  toTreeNodes(rowNodes: ITreeNodeValue[]): ITreeNode[] {
    const nodes = this.convertToTreeNodes(rowNodes);
    const rootNode = { id: 0, children: nodes };
    this.prepareTree(rootNode);
    return [rootNode];
  }

  private prepareTree(node: ITreeNode, parent: ITreeNode = null): void {
    node.expanded = !parent || false;
    node.parent = parent;
    (node.children || []).forEach(childNode => this.prepareTree(childNode, node));
  }

  private convertToTreeNodes(rowData: ITreeNodeValue[]): ITreeNode[] {
    return rowData
      .sort((a: any, b: any) =>
        !R.isNil(a.sortOrder) && !R.isNil(b.sortOrder)
          ? a.sortOrder > b.sortOrder ? 1 : -1
          : 0
      )
      .map(organization => this.convertToTreeNode(organization));
  }

  private convertToTreeNode(rowData: any): ITreeNode {
    const hasChildren = rowData.children && rowData.children.length;
    return {
      id: rowData.id,
      bgColor: rowData.boxColor,
      label: rowData.name,
      children: hasChildren ? this.convertToTreeNodes(rowData.children) : null,
      data: rowData
    };
  }
}
