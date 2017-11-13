import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/combineLatest';

import { IOrganizationDialogActionEnum } from '../organizations.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '../../../../shared/components/toolbar-2/toolbar-2.interface';
import { ITreeNode, ITreeNodeInfo } from '../../../../shared/components/flowtree/treenode/treenode.interface';

import { OrganizationsService } from '../organizations.service';
import { UserPermissionsService } from '../../../../core/user/permissions/user-permissions.service';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-organizations-tree',
  templateUrl: './organizations-tree.component.html',
})
export class OrganizationsTreeComponent implements OnDestroy, OnInit {
  permissionSub: Subscription;
  organizations: Observable<ITreeNode[]>;

  toolbarItems: Array<IToolbarItem> = [
    {
      type: ToolbarItemTypeEnum.BUTTON_ADD,
      action: () => this.organizationsService.setDialogAction(IOrganizationDialogActionEnum.ORGANIZATION_ADD),
      enabled: this.userPermissionsService.has('ORGANIZATION_ADD')
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_EDIT,
      action: () => this.organizationsService.setDialogAction(IOrganizationDialogActionEnum.ORGANIZATION_EDIT),
      enabled: Observable.combineLatest(
        this.userPermissionsService.has('ORGANIZATION_EDIT'),
        this.organizationsService.selectedOrganization
      ).map(([hasPermissions, hasSelectedEntity]) => hasPermissions && !!hasSelectedEntity)
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_DELETE,
      action: () => this.organizationsService.setDialogAction(IOrganizationDialogActionEnum.ORGANIZATION_REMOVE),
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

  }

  ngOnInit(): void {
    this.permissionSub = this.canViewOrganization.do(hasViewPermission => hasViewPermission
      ? (this.organizations = this.organizationsService.fetchOrganizations())
      : this.organizationsService.clearOrganizations()
    ).subscribe(() => {
      console.log('Fired!');
    });
  }

  ngOnDestroy(): void {
    this.permissionSub.unsubscribe();
    this.organizationsService.clearAll();
  }

  get action(): Observable<IOrganizationDialogActionEnum> {
    return this.organizationsService.dialogAction;
  }

  get selectedOrganization(): Observable<ITreeNode> {
    return this.organizationsService.selectedOrganization;
  }

  get isEntityBeingCreated(): Observable<boolean> {
    return this.action.map(dialogAction => dialogAction === IOrganizationDialogActionEnum.ORGANIZATION_ADD);
  }

  get isEntityBeingEdited(): Observable<boolean> {
    return this.action.map(dialogAction => dialogAction === IOrganizationDialogActionEnum.ORGANIZATION_EDIT);
  }

  get isEntityBeingRemoved(): Observable<boolean> {
    return this.action.map(dialogAction => dialogAction === IOrganizationDialogActionEnum.ORGANIZATION_REMOVE);
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
    this.organizationsService.removeOrganization().subscribe(() => {});
  }

  onNodeEdit(node: ITreeNode): void {
    this.organizationsService.setDialogAction(IOrganizationDialogActionEnum.ORGANIZATION_EDIT, { selectedOrganization: node });
  }

  cancelAction(): void {
    this.organizationsService.setDialogAction(null);
  }

  fetchOrganizations(): void {
    this.organizationsService.fetchOrganizations().subscribe(() => {});
  }

  createOrganization(data: any): void {
    this.organizationsService.createOrganization(data).subscribe(() => {});
  }

  updateOrganization(data: any): void {
    this.organizationsService.updateOrganization(data).subscribe(() => {});
  }
}
