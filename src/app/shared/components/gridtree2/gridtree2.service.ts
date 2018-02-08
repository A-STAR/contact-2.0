import { Injectable } from '@angular/core';
import { ColDef } from 'ag-grid';

@Injectable()
export class GridTree2Service {

  constructor() { }

  moveToPath(autoGroupColumnDef: ColDef, newParentPath: any[], node: any, allUpdatedNodes: any[]): void {
    const oldPath = node.data[autoGroupColumnDef.field];
    const fileName = oldPath[oldPath.length - 1];
    const newChildPath = newParentPath.slice();

    newChildPath.push(fileName);
    node.data[autoGroupColumnDef.field] = newChildPath;
    allUpdatedNodes.push(node.data);

    if (node.childrenAfterGroup) {
      node.childrenAfterGroup
        .forEach(childNode => this.moveToPath(autoGroupColumnDef, newChildPath, childNode, allUpdatedNodes));
    }
  }

  isSelectionParentOfTarget(selectedNode: any, targetNode: any): boolean {
    return selectedNode.childrenAfterGroup.some(item =>
      (targetNode && item.key === targetNode.key)
      || this.isSelectionParentOfTarget(item, targetNode));
  }

  arePathsEqual(path1: any[], path2: any[]): boolean {
    return path1.length === path2.length && path1.some((item, index) => path2[index] === item);
  }

}
