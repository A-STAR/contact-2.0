import { Component, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/distinctUntilKeyChanged';
import 'rxjs/add/observable/combineLatest';

import { IOrganization, IOrganizationDialogActionEnum } from '../organizations.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '../../../../shared/components/toolbar-2/toolbar-2.interface';
import { ITreeNode, ITreeNodeInfo } from '../../../../shared/components/flowtree/treenode/treenode.interface';

import { OrganizationsService } from '../organizations.service';
import { UserPermissionsService } from '../../../../core/user/permissions/user-permissions.service';

import { TreeComponent } from '../../../../shared/components/flowtree/tree.component';

// TODO: separate tree rendering from organizations logic
@Component({
  selector: 'app-organizations-tree',
  templateUrl: './organizations-tree.component.html',
})
export class OrganizationsTreeComponent implements OnDestroy {
  @Input() organizations: Array<IOrganization>;

  @Output() onSelect: EventEmitter<IOrganization> = new EventEmitter<IOrganization>();
  @ViewChild('tree') tree: TreeComponent;

  // TODO: ITreeNode<IOrganization> { ..., data: IOrganization }

  selection: ITreeNode;
  value: ITreeNode[];

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
        this.organizationsService.state.map(state => !!state.selectedOrganizationId)
      ).map(([hasPermissions, hasSelectedEntity]) => hasPermissions && hasSelectedEntity)
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_DELETE,
      action: () => this.organizationsService.setDialogAction(IOrganizationDialogActionEnum.ORGANIZATION_REMOVE),
      enabled: Observable.combineLatest(
        this.userPermissionsService.has('ORGANIZATION_DELETE'),
        this.organizationsService.state.map(state => !!state.selectedOrganizationId)
      ).map(([hasPermissions, hasSelectedEntity]) => hasPermissions && hasSelectedEntity)
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_REFRESH,
      action: () => this.organizationsService.fetchOrganizations(),
      enabled: this.userPermissionsService.has('ORGANIZATION_VIEW')
    },
  ];

  action: IOrganizationDialogActionEnum;

  editedEntity: IOrganization;

  private state$: Subscription;
  private stateOrganizations$: Subscription;

  constructor(
    private organizationsService: OrganizationsService,
    private userPermissionsService: UserPermissionsService,
  ) {
    this.organizationsService.fetchOrganizations();

    this.stateOrganizations$ = this.organizationsService.state
      .distinctUntilKeyChanged('organizations')
      .subscribe(
        state => {
          const nodes = this.convertToTreeNodes(state.organizations);
          const files = {
              id: 0,
              label: 'Home',
              children: [].concat(nodes),
            };
            this.value = [files];
            this.prepareTree(this.value[0]);
        },
        error => console.error(error)
      );

    this.state$ = this.organizationsService.state
      .subscribe(
        state => {
          this.action = state.dialogAction;
          this.editedEntity = state.organizations.find(organization => organization.id === state.selectedOrganizationId);
        },
        // TODO: notifications
        error => console.error(error)
      );
  }

  ngOnDestroy(): void {
    this.state$.unsubscribe();
    this.stateOrganizations$.unsubscribe();
  }

  get isEntityBeingCreated(): boolean {
    return this.action === IOrganizationDialogActionEnum.ORGANIZATION_ADD;
  }

  get isEntityBeingEdited(): boolean {
    return this.action === IOrganizationDialogActionEnum.ORGANIZATION_EDIT;
  }

  get isEntityBeingRemoved(): boolean {
    return this.action === IOrganizationDialogActionEnum.ORGANIZATION_REMOVE;
  }

  private convertToTreeNodes(organizations: Array<IOrganization>): Array<ITreeNode> {
    return organizations
      .sort((a: IOrganization, b: IOrganization) => a.sortOrder > b.sortOrder ? 1 : -1)
      .map(organization => this.convertToTreeNode(organization));
  }

  private convertToTreeNode(organization: IOrganization): ITreeNode {
    const hasChildren = organization.children && organization.children.length;
    return {
      id: organization.id,
      bgColor: organization.boxColor,
      label: organization.name,
      children: hasChildren ? this.convertToTreeNodes(organization.children) : undefined,
      data: organization
    };
  }

  onChangeNodesLocation(payload: ITreeNodeInfo[]): void {
    this.organizationsService.updateOrganizations(payload);
  }

  onNodeSelect({ node }: { node: ITreeNode }): void {
    this.onNodeSelectOrExpand(node);
    const isExpanded = node.expanded;
    if (node.children) {
      node.expanded = !isExpanded;
    }
  }

  onNodeExpand({ node }: { node: ITreeNode }): void {
    this.onNodeSelectOrExpand(node);
  }

  onNodeSelectOrExpand(node: ITreeNode): void {
    const parent = this.findParentRecursive(node);
    this.collapseSiblings(parent);
    this.selection = node;
    this.organizationsService.selectOrganization(node.data.id);
    this.onSelect.emit(node.data);
  }

  cancelAction(): void {
    this.organizationsService.setDialogAction(null);
  }

  onNodeEdit(data: any): void {
    this.organizationsService.setDialogAction(IOrganizationDialogActionEnum.ORGANIZATION_EDIT);
  }

  onEditSubmit(data: any, create: boolean): void {
    if (create) {
      this.organizationsService.createOrganization(this.selection ? this.selection.data.id : null, data);
    } else {
      this.organizationsService.updateOrganization(data);
    }
  }

  onRemoveSubmit(): void {
    this.organizationsService.deleteOrganization();
  }

  private findParentRecursive(node: ITreeNode, parent: ITreeNode[] = null): any {
    if (!parent) {
      return this.findParentRecursive(node, this.tree.value);
    }

    return parent.reduce((acc, child) => {
      if (child.id === node.id) {
        // NOTE: return parent since we are looking for the element's siblings!
        return parent;
      }

      if (child.children) {
        return this.findParentRecursive(node, child.children) || acc;
      }

      return acc;

    }, null);
  }

  private collapseSiblings(nodes: ITreeNode[]): void {
    if (!nodes || !nodes.length) {
      return;
    }
    nodes.forEach(childNode => {
      childNode.expanded = false;
      this.collapseChildrenRecursive(childNode);
    });
  }

  private collapseChildrenRecursive(node: ITreeNode): void {
    if (!node || !node.children) {
      return;
    }
    node.children.forEach(childNode => {
      childNode.expanded = false;
      this.collapseChildrenRecursive(childNode);
    });
  }

  private prepareTree(node: ITreeNode, parent: ITreeNode = null): void {
    node.expanded = false;
    node.parent = parent;
    if (node.children) {
      node.children.forEach(childNode => {
        this.prepareTree(childNode, node);
      });
    }
  }
}
