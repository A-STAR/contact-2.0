import { Component, Input, OnChanges, SimpleChange } from '@angular/core';

import { IPermissionRole } from '../permissions/permissions.interface';
import { IToolbarAction, ToolbarActionTypeEnum } from '../../../../shared/components/toolbar/toolbar.interface';

import { TreeNode } from '../../../../shared/components/flowtree/common/api';
import { PermissionsTreeService } from './permissions-tree.service';

@Component({
  selector: 'app-permissions-tree',
  templateUrl: './permissions-tree.component.html',
})
export class PermissionsTreeComponent implements OnChanges {

  @Input() currentRole: IPermissionRole;

  initialSelection: TreeNode[] = [];
  selection: TreeNode[] = [];
  value: TreeNode[];

  toolbarActions: IToolbarAction[] = [
    { text: 'toolbar.action.save', type: ToolbarActionTypeEnum.SAVE },
  ];

  constructor(private permissionsTreeService: PermissionsTreeService) {
  }

  ngOnChanges(changes: { [propertyName: string]: SimpleChange }): void {
    this.refreshTree();
  }

  onSaveChanges(): void {
    this.permissionsTreeService.save(this.currentRole, this.getRemovedItems, this.getAddedItems)
      .subscribe(() => {
        this.initSelectionCopy();
        this.refreshToolbar();
      });
  }

  onSelectionChange(selection: TreeNode[]): void {
    this.selection = selection;
    this.refreshToolbar();
  }

  private refreshToolbar(): void {
    this.toolbarActions[0].visible = this.getRemovedItems.length > 0 || this.getAddedItems.length > 0;
  }

  private refreshTree(): void {
    if (!this.currentRole) {
      return;
    }
    this.permissionsTreeService.load(this.currentRole, this.selection)
      .subscribe((data: TreeNode[]) => {
        this.value = data;
        this.initSelectionCopy();
      });
  }

  private initSelectionCopy(): void {
    this.initialSelection = [].concat(this.selection);
  }

  private get getRemovedItems(): TreeNode[] {
    return this.permissionsTreeService.getDiff(this.initialSelection, this.selection);
  }

  private get getAddedItems(): TreeNode[] {
    return this.permissionsTreeService.getDiff(this.selection, this.initialSelection);
  }
}
