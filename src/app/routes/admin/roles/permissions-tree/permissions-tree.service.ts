import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { TranslateService } from '@ngx-translate/core';

import { IPermissionRole } from '../permissions/permissions.interface';
import { IPermissionsTreeNode } from './permissions-tree.interface';

import { TreeNode } from '../../../../shared/components/flowtree/common/api';
import { GridService } from '../../../../shared/components/grid/grid.service';
import { menuConfig } from '../../../menu-config';

@Injectable()
export class PermissionsTreeService {

  constructor(private gridService: GridService,
              private translateService: TranslateService) {
  }

  load(currentRole: IPermissionRole, selection: TreeNode[]): Observable<TreeNode[]> {
    return this.gridService.read('/roles/{id}/guiobjects', currentRole)
      .map(data => this.convertToTreeNodes(data.appGuiObjects, selection));
  }

  save(currentRole: IPermissionRole, removed: TreeNode[], added: TreeNode[]): Observable<any> {
    return Observable.forkJoin(
      this.filterAndConvertToIds(removed)
        .map((id: number) => this.updatePermissions(currentRole, id, false))
        .concat(
          this.filterAndConvertToIds(added).map((id: number) => this.updatePermissions(currentRole, id, true))
        )
    );
  }

  getDiff(nodes: TreeNode[], nodes2: TreeNode[]): TreeNode[] {
    return nodes
      .filter((node: TreeNode) => !node.children && !nodes2.find((node2: TreeNode) => node2 === node))
  }

  private updatePermissions(currentRole: IPermissionRole, id: number, add: boolean): Observable<any> {
    return this.gridService.update(`/roles/{id}/guiobjects/${id}`, currentRole, { value: add });
  }

  private filterAndConvertToIds(nodes: TreeNode[]): number[] {
    return nodes
      .map((treeNode: TreeNode) => treeNode.id);
  }

  private convertToTreeNodes(permissions: IPermissionsTreeNode[], selection: TreeNode[]): TreeNode[] {
    return permissions
      .map((permission: IPermissionsTreeNode) => {
        const node: TreeNode = this.convertToTreeNode(permission, selection);
        if (permission.value) {
          selection.push(node);
        }
        return node;
      });
  }

  private convertToTreeNode(permission: IPermissionsTreeNode, selection: TreeNode[]): TreeNode {
    const hasChildren = permission.children && permission.children.length;
    return {
      id: permission.id,
      label: this.translateService.instant(
        menuConfig.hasOwnProperty(permission.name) ? menuConfig[permission.name].text : permission.name
      ) || permission.name,
      expanded: true,
      children: hasChildren ? this.convertToTreeNodes(permission.children, selection) : undefined,
      data: permission,
      icon: hasChildren ? 'fa fa-folder-o' : '',
      expandedIcon: hasChildren ? 'fa fa-folder-open-o' : ''
    };
  }
}
