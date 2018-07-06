import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { distinctUntilKeyChanged } from 'rxjs/operators';

import { IPermissionRole } from '../permissions.interface';
import {
  IToolbarItem,
  ToolbarItemTypeEnum
} from '@app/shared/components/toolbar-2/toolbar-2.interface';
import { ITreeNode } from '@app/shared/components/flowtree/treenode/treenode.interface';

import { GuiObjectsService } from '@app/core/gui-objects/gui-objects.service';
import { PermissionsTreeService } from './permissions-tree.service';
import { PermissionsService } from '../permissions.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-size' },
  selector: 'app-permissions-tree',
  templateUrl: './permissions-tree.component.html',
})
export class PermissionsTreeComponent implements OnDestroy {
  initialSelection: ITreeNode[] = [];
  selection: ITreeNode[] = [];
  value: ITreeNode[];

  private changes: Subject<boolean> = new BehaviorSubject(false);

  readonly hasViewPermission: Observable<boolean> = this.userPermissionsService.has('GUI_TREE_VIEW');
  readonly hasEditPermission: Observable<boolean> = this.userPermissionsService.has('GUI_TREE_EDIT');

  toolbarActions: Array<IToolbarItem> = [
    {
      type: ToolbarItemTypeEnum.BUTTON_SAVE,
      action: () => this.onSaveChanges(),
      enabled: combineLatest(
        this.userPermissionsService.has('GUI_TREE_EDIT'),
        this.changes
      ).map(([rights, changes]) => rights && changes)
    },
  ];

  private currentRole: IPermissionRole;
  private permissionsServiceSub: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private guiObjectsService: GuiObjectsService,
    private permissionsTreeService: PermissionsTreeService,
    private permissionsService: PermissionsService,
    private userPermissionsService: UserPermissionsService
  ) {
    this.permissionsServiceSub = this.permissionsService.permissions
      .pipe(distinctUntilKeyChanged('currentRole'))
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
        this.guiObjectsService.refreshGuiObjects();
        this.initSelectionCopy();
      });
  }

  onSelectionChange(selection: ITreeNode[]): void {
    this.selection = selection;
    this.changes.next(!!this.getRemovedItems.length || !!this.getAddedItems.length);
  }

  private refreshTree(): void {
    if (!this.currentRole) {
      this.value = null;
      this.selection = [];
      this.initialSelection = [];
      return;
    }
    this.permissionsTreeService.load(this.currentRole, this.selection)
      .subscribe((data: ITreeNode[]) => {
        this.value = data;
        this.initSelectionCopy();
        this.cdRef.markForCheck();
      });
  }

  private initSelectionCopy(): void {
    this.initialSelection = [].concat(this.selection);
  }

  private get getRemovedItems(): ITreeNode[] {
    return this.permissionsTreeService.getDiff(this.initialSelection, this.selection);
  }

  private get getAddedItems(): ITreeNode[] {
    return this.permissionsTreeService.getDiff(this.selection, this.initialSelection);
  }
}
