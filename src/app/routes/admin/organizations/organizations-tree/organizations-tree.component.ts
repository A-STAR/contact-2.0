import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { merge } from 'rxjs/observable/merge';

import { ITitlebar, TitlebarItemTypeEnum } from '@app/shared/components/titlebar/titlebar.interface';
import { ITreeNode, ITreeNodeInfo } from '@app/shared/components/flowtree/treenode/treenode.interface';

import { OrganizationsService } from '../organizations.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

import { DialogFunctions } from '@app/core/dialog';
import { combineLatestAnd } from '@app/core/utils/helpers';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-height' },
  selector: 'app-organizations-tree',
  templateUrl: './organizations-tree.component.html',
})
export class OrganizationsTreeComponent extends DialogFunctions implements OnDestroy, OnInit {
  permissionSub: Subscription;
  organizations: Observable<ITreeNode[]>;
  dialog: string;

  titlebar: ITitlebar = {
    title: 'organizations.title',
    items: [
      {
        type: TitlebarItemTypeEnum.BUTTON_ADD,
        action: () => this.setDialog('create'),
        enabled: this.userPermissionsService.has('ORGANIZATION_ADD')
      },
      {
        type: TitlebarItemTypeEnum.BUTTON_EDIT,
        action: () => this.setDialog('edit'),
        enabled: combineLatestAnd([
          this.userPermissionsService.has('ORGANIZATION_EDIT'),
          this.organizationsService.selectedOrganization.map(o => !!o)
        ])
      },
      {
        type: TitlebarItemTypeEnum.BUTTON_DELETE,
        action: () => this.setDialog('remove'),
        enabled: combineLatestAnd([
          this.userPermissionsService.has('ORGANIZATION_DELETE'),
          this.organizationsService.selectedOrganization.map(o => !!o)
        ])
      },
      {
        type: TitlebarItemTypeEnum.BUTTON_REFRESH,
        action: () => this.fetchOrganizations(),
        enabled: this.userPermissionsService.has('ORGANIZATION_VIEW')
      },
    ]
  };

  constructor(
    private organizationsService: OrganizationsService,
    private userPermissionsService: UserPermissionsService,
    private cdRef: ChangeDetectorRef
  ) {
      super();
  }

  ngOnInit(): void {
    this.permissionSub = this.canViewOrganization.do(hasViewPermission => hasViewPermission
      ? (this.organizations = merge(
          this.organizationsService.fetchOrganizations(),
          this.organizationsService.organizations)
        )
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
    this.setDialog('edit');
    this.organizationsService.selectOrganization(node);
  }

  cancelAction(): void {
    this.organizationsService.selectOrganization(null);
    this.onCloseDialog();
    this.cdRef.markForCheck();
  }

  fetchOrganizations(): void {
    this.organizationsService.fetchOrganizations().subscribe(() => {
      this.organizationsService.selectOrganization(null);
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
