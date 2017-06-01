import { Component, Input, OnChanges, SimpleChange } from '@angular/core';

import { TreeNode } from '../../../../shared/components/flowtree/common/api';
import { GridService } from '../../../../shared/components/grid/grid.service';
import { IPermissionRole } from "../permissions/permissions.interface";

@Component({
  selector: 'app-permissions-tree',
  templateUrl: './permissions-tree.component.html'
})
export class PermissionsTreeComponent implements OnChanges {

  @Input() currentRole: IPermissionRole;

  selection: TreeNode;
  value: TreeNode[];

  constructor(private gridService: GridService) {
  }

  ngOnChanges(changes: { [propertyName: string]: SimpleChange }): void {
    this.refreshTree();
  }

  onNodeSelect(x) {
    console.log(x);
  }

  private refreshTree(): void {
    if (!this.currentRole) {
      return;
    }
    this.gridService.read('/roles/{id}/guiobjects', this.currentRole).subscribe((data: any) => {
      this.value = this.convertToTreeNodes(data.appGuiObjects);
    });
  }

  private convertToTreeNodes(organizations: Array<any>): Array<TreeNode> {
    return organizations
      .map(organization => this.convertToTreeNode(organization));
  }

  private convertToTreeNode(permission: any): TreeNode {
    const hasChildren = permission.children && permission.children.length;
    return {
      id: permission.id,
      label: permission.name,
      expanded: true,
      partialSelected: permission.partialSelected,
      children: hasChildren ? this.convertToTreeNodes(permission.children) : undefined,
      data: permission
    };
  }
}
