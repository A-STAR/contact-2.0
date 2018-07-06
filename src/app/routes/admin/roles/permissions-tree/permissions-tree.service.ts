import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { TranslateService } from '@ngx-translate/core';

import { IPermissionRole } from '../permissions.interface';
import { IPermissionsTreeNode } from './permissions-tree.interface';
import { ITreeNode } from '../../../../shared/components/flowtree/treenode/treenode.interface';

import { DataService } from '../../../../core/data/data.service';

import { menuConfig } from '../../../menu-config';

@Injectable()
export class PermissionsTreeService {

  constructor(
    private dataService: DataService,
    private translateService: TranslateService
  ) {}

  load(currentRole: IPermissionRole, selection: ITreeNode[]): Observable<ITreeNode[]> {
    return this.dataService.readAll('/roles/{id}/guiobjects', currentRole)
      .map(data => this.convertToTreeNodes(data, selection));
  }

  save(currentRole: IPermissionRole, removed: ITreeNode[], added: ITreeNode[]): Observable<any> {
    const data = {
      objects: [
        ...added.map(node => ({ id: node.id, value: true })),
        ...removed.map(node => ({ id: node.id, value: false }))
      ]
    };
    return this.update(currentRole, data);
  }

  getDiff(nodes: ITreeNode[], nodes2: ITreeNode[]): ITreeNode[] {
    return nodes.filter(node1 => !node1.children && !nodes2.find(node2 => node1 === node2));
  }

  private update(currentRole: IPermissionRole, data: object): Observable<any> {
    return this.dataService.update('/roles/{id}/guiobjects', currentRole, data);
  }

  private convertToTreeNodes(permissions: IPermissionsTreeNode[], selection: ITreeNode[]): ITreeNode[] {
    return permissions
      .map(permission => {
        const node = this.convertToTreeNode(permission, selection);
        if (permission.value) {
          selection.push(node);
        }
        return node;
      });
  }

  private convertToTreeNode(permission: IPermissionsTreeNode, selection: ITreeNode[]): ITreeNode {
    const hasChildren = permission.children && permission.children.length > 0;
    const cfg = menuConfig.hasOwnProperty(permission.name) ? menuConfig[permission.name] : null;

    return {
      id: permission.id,
      label: this.translateService.instant(cfg && cfg.text ? cfg.text : permission.name) || permission.name,
      expanded: hasChildren,
      children: hasChildren ? this.convertToTreeNodes(permission.children, selection) : undefined,
      data: permission,
      icon: hasChildren ? 'fa fa-folder-o' : '',
      // icon: hasChildren ? 'fa fa-folder-o' : (cfg ? cfg.icon : ''),
      expandedIcon: hasChildren ? 'fa fa-folder-open-o' : ''
    };
  }
}
