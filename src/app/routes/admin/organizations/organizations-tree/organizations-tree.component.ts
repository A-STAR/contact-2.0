import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';

import { IOrganizationDialogActionEnum } from '../organizations.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '../../../../shared/components/toolbar-2/toolbar-2.interface';
import { ITreeNode, ITreeNodeInfo } from '../../../../shared/components/flowtree/treenode/treenode.interface';

import { OrganizationsService } from '../organizations.service';
import { UserPermissionsService } from '../../../../core/user/permissions/user-permissions.service';
import { ObservableHelper } from '../../../../core/observable/ObservableHelper';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-organizations-tree',
  templateUrl: './organizations-tree.component.html',
})
export class OrganizationsTreeComponent {

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
    ObservableHelper.subscribe(
      this.userPermissionsService.has('ORGANIZATION_VIEW').subscribe(hasViewPermission => hasViewPermission
        ? this.organizationsService.fetchOrganizations()
        : this.organizationsService.clearOrganizations()
      ),
      this
    );
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

  onChangeNodesLocation(payload: ITreeNodeInfo[]): void {
    this.organizationsService.updateOrganizations(payload);
  }

  onNodeSelect({ node }: { node: ITreeNode }): void {
    this.organizationsService.selectOrganization(node);
  }

  onNodeExpand({ node }: { node: ITreeNode }): void {
    this.organizationsService.selectOrganization(node);
  };

  cancelAction(): void {
    this.organizationsService.setDialogAction(null);
  }

  onNodeEdit(node: ITreeNode): void {
    this.userPermissionsService.has('ORGANIZATION_EDIT')
      .take(1)
      .subscribe(hasEditPermission => {
        if (hasEditPermission) {
          this.organizationsService.setDialogAction(IOrganizationDialogActionEnum.ORGANIZATION_EDIT, node);
        }
      });
  }

  onEditSubmit(data: any, create: boolean): void {
    if (create) {
      this.organizationsService.createOrganization(data);
    } else {
      this.organizationsService.updateOrganization(data);
    }
  }

  onRemoveSubmit(): void {
    this.organizationsService.deleteOrganization();
  }
}
