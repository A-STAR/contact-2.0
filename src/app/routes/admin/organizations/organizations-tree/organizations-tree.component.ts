import {
  ChangeDetectionStrategy,
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

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-organizations-tree',
  templateUrl: './organizations-tree.component.html',
})
export class OrganizationsTreeComponent implements OnDestroy {
  permissionSub: Subscription;

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
      action: () => this.organizationsService.fetchOrganizations(),
      enabled: this.userPermissionsService.has('ORGANIZATION_VIEW')
    },
  ];

  constructor(
    private organizationsService: OrganizationsService,
    private userPermissionsService: UserPermissionsService,
  ) {
    this.permissionSub = this.canViewOrganization.subscribe(hasViewPermission => hasViewPermission
      ? this.organizationsService.fetchOrganizations()
      : this.organizationsService.clearOrganizations()
    );
  }

  ngOnDestroy(): void {
    this.permissionSub.unsubscribe();
    this.organizationsService.clearAll();
  }

  get organizations(): Observable<ITreeNode[]> {
    return this.organizationsService.organizations;
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
    this.organizationsService.updateOrganizations(payload);
  }

  onNodeSelect({ node }: { node: ITreeNode }): void {
    this.organizationsService.selectOrganization(node);
  }

  onRemove(): void {
    this.organizationsService.deleteOrganization();
  }

  onNodeEdit(node: ITreeNode): void {
    this.organizationsService.setDialogAction(IOrganizationDialogActionEnum.ORGANIZATION_EDIT, { selectedOrganization: node });
  }

  cancelAction(): void {
    this.organizationsService.setDialogAction(null);
  }

  createOrganization(data: any): void {
    this.organizationsService.createOrganization(data);
  }

  updateOrganization(data: any): void {
    this.organizationsService.updateOrganization(data);
  }
}
