import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/combineLatest';

import { OrganizationDialogActionEnum } from '../organizations.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '../../../../shared/components/toolbar-2/toolbar-2.interface';
import { ITreeNode, ITreeNodeInfo } from '../../../../shared/components/flowtree/treenode/treenode.interface';

import { OrganizationsService } from '../organizations.service';
import { UserPermissionsService } from '../../../../core/user/permissions/user-permissions.service';
import { DialogFunctions } from 'app/core/dialog';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-organizations-tree',
  templateUrl: './organizations-tree.component.html',
})
export class OrganizationsTreeComponent extends DialogFunctions implements OnDestroy, OnInit {
  permissionSub: Subscription;
  organizations: Observable<ITreeNode[]>;
  dialog: string;
  private currentDialogAction: OrganizationDialogActionEnum = OrganizationDialogActionEnum.NONE;

  toolbarItems: Array<IToolbarItem> = [
    {
      type: ToolbarItemTypeEnum.BUTTON_ADD,
      action: () => this.currentDialogAction = OrganizationDialogActionEnum.ORGANIZATION_ADD,
      enabled: this.userPermissionsService.has('ORGANIZATION_ADD')
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_EDIT,
      action: () => this.currentDialogAction = OrganizationDialogActionEnum.ORGANIZATION_EDIT,
      enabled: Observable.combineLatest(
        this.userPermissionsService.has('ORGANIZATION_EDIT'),
        this.organizationsService.selectedOrganization
      ).map(([hasPermissions, hasSelectedEntity]) => hasPermissions && !!hasSelectedEntity)
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_DELETE,
      action: () => this.currentDialogAction = OrganizationDialogActionEnum.ORGANIZATION_REMOVE,
      enabled: Observable.combineLatest(
        this.userPermissionsService.has('ORGANIZATION_DELETE'),
        this.organizationsService.selectedOrganization
      ).map(([hasPermissions, hasSelectedEntity]) => hasPermissions && !!hasSelectedEntity)
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_REFRESH,
      action: () => this.fetchOrganizations(),
      enabled: this.userPermissionsService.has('ORGANIZATION_VIEW')
    },
  ];

  constructor(
    private organizationsService: OrganizationsService,
    private userPermissionsService: UserPermissionsService,
    private cdRef: ChangeDetectorRef
  ) {
      super();
  }

  ngOnInit(): void {
    this.permissionSub = this.canViewOrganization.do(hasViewPermission => hasViewPermission
      ? (this.organizations = Observable.merge(this.organizationsService.fetchOrganizations(),
       this.organizationsService.organizations))
      : this.organizationsService.clearOrganizations()
    ).subscribe(() => {
      this.cdRef.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.permissionSub.unsubscribe();
    this.organizationsService.clearAll();
  }

  get selectedOrganization(): Observable<ITreeNode> {
    return this.organizationsService.selectedOrganization;
  }

  get isEntityBeingCreated(): boolean {
    return this.currentDialogAction === OrganizationDialogActionEnum.ORGANIZATION_ADD;
  }

  get isEntityBeingEdited(): boolean {
    return this.currentDialogAction === OrganizationDialogActionEnum.ORGANIZATION_EDIT;
  }

  get isEntityBeingRemoved(): boolean {
    return this.currentDialogAction === OrganizationDialogActionEnum.ORGANIZATION_REMOVE;
  }

  get canViewOrganization(): Observable<boolean> {
    return this.userPermissionsService.has('ORGANIZATION_VIEW');
  }

  get canEditOrganization(): Observable<boolean> {
    return this.userPermissionsService.has('ORGANIZATION_EDIT');
  }

  onChangeNodesLocation(payload: ITreeNodeInfo[]): void {
    this.organizationsService.updateOrganizations(payload).subscribe(() => {});
  }

  onNodeSelect({ node }: { node: ITreeNode }): void {
    this.organizationsService.selectOrganization(node);
    this.organizationsService.fetchEmployees().subscribe(() => {});
  }

  onRemove(): void {
    this.organizationsService.removeOrganization().subscribe(() => this.cancelAction());
  }

  onNodeEdit(node: ITreeNode): void {
    this.currentDialogAction = OrganizationDialogActionEnum.ORGANIZATION_EDIT;
    this.organizationsService.selectOrganization(node);
  }

  cancelAction(): void {
    this.currentDialogAction = OrganizationDialogActionEnum.NONE;
    // reset previously selected organization
    this.organizationsService.selectOrganization(null);
    this.onCloseDialog();
    this.cdRef.markForCheck();
  }

  fetchOrganizations(): void {
    this.organizationsService.fetchOrganizations().subscribe(() => {
      this.cdRef.markForCheck();
    });
  }

  createOrganization(data: any): void {
    this.organizationsService.createOrganization(data).subscribe(() => {
      this.cancelAction();
    });
  }

  updateOrganization(data: any): void {
    this.organizationsService.updateOrganization(data).subscribe(() => this.cancelAction());
  }
}
