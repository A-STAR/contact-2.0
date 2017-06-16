import { Component, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/distinctUntilKeyChanged';

import { IPermissionRole } from '../roles-and-permissions.interface';
import { IToolbarAction, ToolbarActionTypeEnum } from '../../../../shared/components/toolbar/toolbar.interface';

import { TreeNode } from '../../../../shared/components/flowtree/common/api';
import { PermissionsTreeService } from './permissions-tree.service';
import { PermissionsService } from '../../../../core/permissions/permissions.service';

@Component({
  selector: 'app-permissions-tree',
  templateUrl: './permissions-tree.component.html',
})
export class PermissionsTreeComponent implements OnDestroy {

  initialSelection: TreeNode[] = [];
  selection: TreeNode[] = [];
  value: TreeNode[];

  toolbarActions: IToolbarAction[] = [
    { text: 'toolbar.action.save', type: ToolbarActionTypeEnum.SAVE, permission: 'GUI_TREE_EDIT' },
  ];

  private currentRole: IPermissionRole;
  private permissionsServiceSub: Subscription;

  constructor(
    private permissionsTreeService: PermissionsTreeService,
    private permissionsService: PermissionsService
  ) {
    this.permissionsServiceSub = this.permissionsService.permissions
      .distinctUntilKeyChanged('currentRole')
      .subscribe(permissions => {
        this.currentRole = permissions.currentRole;
        this.refreshTree();
      });
  }

  ngOnDestroy(): void {
    this.permissionsServiceSub.unsubscribe();
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
    this.toolbarActions[0].visible = !!this.getRemovedItems.length || !!this.getAddedItems.length;
  }

  private refreshTree(): void {
    if (!this.currentRole) {
      this.value = null;
      this.selection = [];
      this.initialSelection = [];
      this.refreshToolbar();
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

  get hasViewPermission(): Observable<boolean> {
    return this.permissionsService.hasPermission('GUI_TREE_VIEW');
  }

  get hasEditPermission(): Observable<boolean> {
    return this.permissionsService.hasPermission('GUI_TREE_EDIT');
  }
}
