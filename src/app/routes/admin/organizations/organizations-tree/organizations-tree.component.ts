import { Component, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/distinctUntilKeyChanged';

import { ITreeNodeInfo } from '../../../../shared/components/flowtree/tree.interface';
import { IOrganization, IOrganizationDialogActionEnum } from '../organizations.interface';
import { IToolbarAction, ToolbarActionTypeEnum } from '../../../../shared/components/toolbar/toolbar.interface';
import { TreeNode } from '../../../../shared/components/flowtree/common/api';

import { OrganizationsService } from '../organizations.service';

import { TreeComponent } from '../../../../shared/components/flowtree/tree.component';

// TODO: extend from GridEntityComponent
// TODO: separate tree rendering from organizations logic
@Component({
  selector: 'app-organizations-tree',
  templateUrl: './organizations-tree.component.html',
  styleUrls: ['./organizations-tree.component.scss']
})
export class OrganizationsTreeComponent implements OnDestroy {
  @Input() organizations: Array<IOrganization>;

  @Output() onSelect: EventEmitter<IOrganization> = new EventEmitter<IOrganization>();
  @ViewChild('tree') tree: TreeComponent;

  // TODO: TreeNode<IOrganization> { ..., data: IOrganization }

  selection: TreeNode;
  value: TreeNode[];

  toolbarActions: Array<IToolbarAction> = [
    { text: 'Добавить', type: ToolbarActionTypeEnum.ADD, visible: true, permission: 'ORGANIZATION_ADD' },
    { text: 'Изменить', type: ToolbarActionTypeEnum.EDIT, visible: false, permission: 'ORGANIZATION_EDIT' },
    { text: 'Удалить', type: ToolbarActionTypeEnum.REMOVE, visible: false, permission: 'ORGANIZATION_DELETE' },
    { text: 'toolbar.action.refresh', type: ToolbarActionTypeEnum.REFRESH, visible: true },
  ];

  toolbarActionsGroup: Array<ToolbarActionTypeEnum> = [
    ToolbarActionTypeEnum.EDIT,
    ToolbarActionTypeEnum.REMOVE,
  ];

  action: IOrganizationDialogActionEnum;

  editedEntity: IOrganization;

  private state$: Subscription;
  private stateOrganizations$: Subscription;

  constructor(
    private organizationsService: OrganizationsService,
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

          // FIXME
          this.refreshToolbar();
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

  private convertToTreeNodes(organizations: Array<IOrganization>): Array<TreeNode> {
    return organizations
      .sort((a: IOrganization, b: IOrganization) => a.sortOrder > b.sortOrder ? 1 : -1)
      .map(organization => this.convertToTreeNode(organization));
  }

  private convertToTreeNode(organization: IOrganization): TreeNode {
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

  onNodeSelect({ node }: { node: TreeNode }): void {
    this.onNodeSelectOrExpand(node);
    const isExpanded = node.expanded;
    if (node.children) {
      node.expanded = !isExpanded;
    }
  }

  onNodeExpand({ node }: { node: TreeNode }): void {
    this.onNodeSelectOrExpand(node);
  }

  onNodeSelectOrExpand(node: TreeNode): void {
    const parent = this.findParentRecursive(node);
    this.collapseSiblings(parent);
    this.selection = node;
    this.organizationsService.selectOrganization(node.data.id);
    this.onSelect.emit(node.data);
  }

  onToolbarAction(action: IToolbarAction): void {
    switch (action.type) {
      case ToolbarActionTypeEnum.REFRESH:
        // FIXME
        this.selection = [];
        this.organizationsService.fetchOrganizations();
        break;
      case ToolbarActionTypeEnum.ADD:
        this.organizationsService.setDialogAction(IOrganizationDialogActionEnum.ORGANIZATION_ADD);
        break;
      case ToolbarActionTypeEnum.EDIT:
        this.organizationsService.setDialogAction(IOrganizationDialogActionEnum.ORGANIZATION_EDIT);
        break;
      case ToolbarActionTypeEnum.REMOVE:
        this.organizationsService.setDialogAction(IOrganizationDialogActionEnum.ORGANIZATION_REMOVE);
        break;
      default:
        this.organizationsService.setDialogAction(null);
    }
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

  private findParentRecursive(node: TreeNode, parent: TreeNode[] = null): any {
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

  private collapseSiblings(nodes: TreeNode[]): void {
    if (!nodes || !nodes.length) {
      return;
    }
    nodes.forEach(childNode => {
      childNode.expanded = false;
      this.collapseChildrenRecursive(childNode);
    });
  }

  private collapseChildrenRecursive(node: TreeNode): void {
    if (!node || !node.children) {
      return;
    }
    node.children.forEach(childNode => {
      childNode.expanded = false;
      this.collapseChildrenRecursive(childNode);
    });
  }

  private prepareTree(node: TreeNode, parent: TreeNode = null): void {
    node.expanded = false;
    node.parent = parent;
    if (node.children) {
      node.children.forEach(childNode => {
        this.prepareTree(childNode, node);
      });
    }
  }

  private refreshToolbar(): void {
    this.setActionsVisibility(this.toolbarActionsGroup, !!this.selection);
  }

  private setActionsVisibility(actionTypesGroup: Array<ToolbarActionTypeEnum>, visible: boolean): void {
    actionTypesGroup.forEach((actionType: ToolbarActionTypeEnum) => {
      this.toolbarActions.find((action: IToolbarAction) => actionType === action.type).visible = visible;
    });
  }
}
