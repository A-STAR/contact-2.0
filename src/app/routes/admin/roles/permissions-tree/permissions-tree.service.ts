import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { TranslateService } from '@ngx-translate/core';

import { IPermissionRole } from '../permissions.interface';
import { IPermissionsTreeNode } from './permissions-tree.interface';
import { ITreeNode } from '../../../../shared/components/flowtree/treenode/treenode.interface';

import { GridService } from '../../../../shared/components/grid/grid.service';
import { menuConfig } from '../../../menu-config';

@Injectable()
export class PermissionsTreeService {

  constructor(private gridService: GridService,
              private translateService: TranslateService) {
  }

  load(currentRole: IPermissionRole, selection: ITreeNode[]): Observable<ITreeNode[]> {
    return this.gridService.read('/roles/{id}/guiobjects', currentRole)
      .map(data => this.convertToTreeNodes(data.appGuiObjects, selection));
  }

  save(currentRole: IPermissionRole, removed: ITreeNode[], added: ITreeNode[]): Observable<any> {
    return Observable.forkJoin(
      this.filterAndConvertToIds(removed)
        .map((id: number) => this.updatePermissions(currentRole, id, false))
        .concat(
          this.filterAndConvertToIds(added).map((id: number) => this.updatePermissions(currentRole, id, true))
        )
    );
  }

  getDiff(nodes: ITreeNode[], nodes2: ITreeNode[]): ITreeNode[] {
    return nodes
      .filter((node: ITreeNode) => !node.children && !nodes2.find((node2: ITreeNode) => node2 === node))
  }

  private updatePermissions(currentRole: IPermissionRole, id: number, add: boolean): Observable<any> {
    return this.gridService.update(`/roles/{id}/guiobjects/${id}`, currentRole, { value: add });
  }

  private filterAndConvertToIds(nodes: ITreeNode[]): number[] {
    return nodes
      .map((ITreeNode: ITreeNode) => ITreeNode.id);
  }

  private convertToTreeNodes(permissions: IPermissionsTreeNode[], selection: ITreeNode[]): ITreeNode[] {
    return permissions
      .map((permission: IPermissionsTreeNode) => {
        const node: ITreeNode = this.convertToTreeNode(permission, selection);
        if (permission.value) {
          selection.push(node);
        }
        return node;
      });
  }

  private convertToTreeNode(permission: IPermissionsTreeNode, selection: ITreeNode[]): ITreeNode {
    const hasChildren: boolean = permission.children && permission.children.length > 0;
    const cfg = menuConfig.hasOwnProperty(permission.name) ? menuConfig[permission.name] : null;

    return {
      id: permission.id,
      label: this.translateService.instant(cfg ? cfg.text : permission.name) || permission.name,
      expanded: hasChildren,
      children: hasChildren ? this.convertToTreeNodes(permission.children, selection) : undefined,
      data: permission,
      icon: hasChildren ? 'fa fa-folder-o' : (cfg ? cfg.icon : ''),
      expandedIcon: hasChildren ? 'fa fa-folder-open-o' : ''
    };
  }
}
