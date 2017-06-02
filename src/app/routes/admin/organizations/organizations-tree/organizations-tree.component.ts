import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IDragAndDropPayload } from '../../../../shared/components/dnd/drag-and-drop.interface';
import { IOrganization } from '../organizations.interface';
import { IToolbarAction, ToolbarActionTypeEnum } from '../../../../shared/components/toolbar/toolbar.interface';
import { TreeNode } from '../../../../shared/components/flowtree/common/api';

import { OrganizationsService } from './organizations.service';

import { TreeComponent } from '../../../../shared/components/flowtree/tree.component';

// TODO: extend from GridEntityComponent
// TODO: separate tree rendering from organizations logic
@Component({
  selector: 'app-organizations-tree',
  templateUrl: './organizations-tree.component.html',
  styleUrls: ['./organizations-tree.component.scss']
})
export class OrganizationsTreeComponent implements OnInit {
  @Output() onSelect: EventEmitter<IOrganization> = new EventEmitter<IOrganization>();
  @ViewChild('tree') tree: TreeComponent;

  // TODO: TreeNode<IOrganization> { ..., data: IOrganization }

  selection: TreeNode;
  value: TreeNode[];

  dragulaOptions = {
    copy: true,
    moves: (el: Element, source: Element) => !source.classList.contains('ui-treenode-root')
  };

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

  action: ToolbarActionTypeEnum;

  constructor(private organizationsService: OrganizationsService) { }

  get isEntityBeingCreated(): boolean {
    return this.action === ToolbarActionTypeEnum.ADD;
  }

  get isEntityBeingEdited(): boolean {
    return this.action === ToolbarActionTypeEnum.EDIT;
  }

  get isEntityBeingRemoved(): boolean {
    return this.action === ToolbarActionTypeEnum.REMOVE;
  }

  load(): void {
    this.organizationsService.load()
      .subscribe(
        data => {
          const files = {
            id: 0,
            label: 'Home',
            children: [].concat(data),
          };
          this.value = [files];
          this.prepareTree(this.rootNode);
        },
        error => console.error(error)
      );
  }

  ngOnInit(): void {
    this.load();
  }

  onNodeChangeLocation(payload: IDragAndDropPayload): void {
    const targetElement: TreeNode = this.findNodeRecursively(this.rootNode, payload.target);
    const sourceElement = this.findNodeRecursively(this.rootNode, payload.source);

    // Caution: this assumes source element has parent
    const hasChangedParent = sourceElement.parent.data.id !== targetElement.data.id;

    const sourceParentElement: TreeNode = sourceElement.parent;
    const sourceParentChildren: TreeNode[] = sourceParentElement.children;

    const sourceElementPosition: number = sourceParentChildren.findIndex((d) => d === sourceElement);
    if (sourceElementPosition > -1) {
      sourceParentChildren.splice(sourceElementPosition, 1);
    }
    if (!sourceParentChildren.length) {
      delete sourceParentElement.children;
      sourceParentElement.expanded = false;
    }

    if (payload.swap) {
      const indexOf = targetElement.parent.children.findIndex((d) => d === targetElement);
      if (indexOf > -1) {
        targetElement.parent.children.splice(indexOf + 1, 0, sourceElement);
      }
      sourceElement.parent = targetElement.parent;
    } else {
      if (!targetElement.children) {
        targetElement.children = [];
      }
      targetElement.children.push(sourceElement);
      sourceElement.parent = targetElement;
    }

    // TODO: do we have to reindex children on previous element parent?
    targetElement.children.forEach((element: TreeNode, i: number) => {
      const sortOrder = i + 1;
      if (element.data.sortOrder !== sortOrder || (hasChangedParent && element.id === sourceElement.id)) {
        element.data.parentId = targetElement.data.id;
        element.data.sortOrder = sortOrder;
        this.organizationsService
          .save(element.data.id, {
            parentId: element.data.parentId,
            sortOrder: element.data.sortOrder
          })
          .subscribe(
            () => {},
            // TODO: error handling
            error => console.error(error)
          );
      }
    });
  }

  findNodeRecursively(node: TreeNode, id: string): TreeNode {
    if (node.id === parseInt(id, 10)) {
      return node;
    }
    if (node.children) {
      let result: TreeNode;
      node.children.forEach((childNode: TreeNode) => {
        const currentNode: TreeNode = this.findNodeRecursively(childNode, id);
        if (currentNode) {
          result = currentNode;
        }
      });
      return result;
    }
    return null;
  }

  onNodeSelect({ node }: { node: TreeNode }): void {
    // use for node selection, could operate on selection collection as well
    const parent = this.findParentRecursive(node);
    const isExpanded = node.expanded;
    this.collapseSiblings(parent);
    if (node.children) {
      node.expanded = !isExpanded;
    }
    this.action = null;
    this.refreshToolbar();
    this.onSelect.emit(node.data);
  }

  onNodeExpand({ node }: { node: TreeNode }): void {
    const parent = this.findParentRecursive(node);
    this.collapseSiblings(parent);
    this.selection = node;
  }

  onToolbarAction(action: IToolbarAction): void {
    switch (action.type) {
      case ToolbarActionTypeEnum.REFRESH:
        this.selection = [];
        this.load();
        break;
      default:
        this.action = action.type;
    }
  }

  cancelAction(): void {
    this.action = null;
  }

  onNodeEdit(data: any): void {
    this.action = ToolbarActionTypeEnum.EDIT;
  }

  onEditSubmit(data: any, create: boolean): void {
    const action = create ?
      this.organizationsService.create(this.selection ? this.selection.data.id : null, data) :
      this.organizationsService.save(this.selection.data.id, data);
    this.submit(action);
  }

  onRemoveSubmit(): void {
    const action = this.organizationsService.remove(this.selection.data.id);
    this.submit(action);
  }

  private submit(action: Observable<any>): void {
    action.subscribe(
      () => {
        this.cancelAction();
        this.selection = [];
        this.load();
      },
      // TODO: error handling
      error => console.error(error)
    );
  }

  private get rootNode(): TreeNode {
    return this.value[0];
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
