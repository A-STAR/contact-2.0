import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  ViewEncapsulation,
} from '@angular/core';
import * as R from 'ramda';

import { DragAndDropComponentPlugin, DragAndDropComponentPluginFactory } from '../dnd/drag-and-drop.component.plugin';

import { IDragAndDropPayload, IDraggedComponent } from '../dnd/drag-and-drop.interface';
import { ITreeNode, ITreeNodeInfo } from './treenode/treenode.interface';

@Component({
  selector: 'app-tree',
  styleUrls: ['./tree.component.scss'],
  templateUrl: './tree.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreeComponent implements IDraggedComponent, OnInit, OnDestroy {
  @Input() value: ITreeNode[];
  @Input() selectionMode: string;
  @Input() selection: ITreeNode|ITreeNode[];
  @Output() selectionChange: EventEmitter<any> = new EventEmitter();
  @Output() onNodeSelect: EventEmitter<any> = new EventEmitter();
  @Output() onNodeUnselect: EventEmitter<any> = new EventEmitter();
  @Output() onNodeExpand: EventEmitter<any> = new EventEmitter();
  @Output() onNodeCollapse: EventEmitter<any> = new EventEmitter();
  @Output() onNodeEdit: EventEmitter<any> = new EventEmitter();
  @Output() changeNodesLocation: EventEmitter<ITreeNodeInfo[]> = new EventEmitter<ITreeNodeInfo[]>();
  @Input() style: any;
  @Input() styleClass: string;
  @Input() layout = 'vertical';
  @Input() metaKeySelection = true;
  @Input() propagateSelectionUp = true;
  @Input() propagateSelectionDown = true;

  dragulaOptions: any = {
    // prevent any drags by default
    invalid: () => true
  };
  private dragAndDropPlugin: DragAndDropComponentPlugin;

  get horizontal(): boolean {
    return this.layout === 'horizontal';
  }

  // TODO(a.poterenko) Check this parameter
  get elementSelector(): string {
    return '.app-treenode-content';
  }

  get selectionAsArray(): ITreeNode[] {
    return this.selection as ITreeNode[];
  }

  constructor(
    public elementRef: ElementRef,
    public renderer: Renderer2,
    dragAndDropComponentPluginFactory: DragAndDropComponentPluginFactory
  ) {
    this.dragAndDropPlugin = dragAndDropComponentPluginFactory.createAndAttachTo(this);
  }

  ngOnInit(): void {
    this.dragAndDropPlugin.ngOnInit();
  }

  ngOnDestroy(): void {
    this.dragAndDropPlugin.ngOnDestroy();
  }

  onNodeClick(event: MouseEvent, node: ITreeNode): void {
    const eventTarget = (<Element> event.target);

    if (eventTarget.className && eventTarget.className.indexOf('app-tree-toggler') === 0) {
      return;
    } else if (this.selectionMode) {
      if (node.selectable === false) {
        return;
      }

      const index = this.findIndexInSelection(node);
      const selected = (index >= 0);

      if (this.isCheckboxSelectionMode()) {
        if (selected) {
          if (this.propagateSelectionDown) {
            this.propagateDown(node, false);
          } else {
            this.selection = this.selectionAsArray.filter((val, i) => i !== index);
          }

          if (this.propagateSelectionUp && node.parent) {
            this.propagateUp(node.parent, false);
          }

          this.selectionChange.emit(this.selection);
          this.onNodeUnselect.emit({originalEvent: event, node: node});
        } else {
          if (this.propagateSelectionDown) {
            this.propagateDown(node, true);
          } else {
            this.selection = [...this.selectionAsArray || [], node];
          }

          if (this.propagateSelectionUp && node.parent) {
            this.propagateUp(node.parent, true);
          }

          this.selectionChange.emit(this.selection);
          this.onNodeSelect.emit({originalEvent: event, node: node});
        }
      } else {
        const metaSelection = this.metaKeySelection;

        if (metaSelection) {
          const metaKey = (event.metaKey || event.ctrlKey);

          if (selected && metaKey) {
            if (this.isSingleSelectionMode()) {
              this.selectionChange.emit(null);
            } else {
              this.selection = this.selectionAsArray.filter((val, i) => i !== index);
              this.selectionChange.emit(this.selection);
            }

            this.onNodeUnselect.emit({originalEvent: event, node: node});
          } else {
            if (this.isSingleSelectionMode()) {
              this.selectionChange.emit(node);
            } else if (this.isMultipleSelectionMode()) {
              this.selection = (!metaKey) ? [] : this.selection || [];
              this.selection = [...this.selectionAsArray, node];
              this.selectionChange.emit(this.selection);
            }

            this.onNodeSelect.emit({originalEvent: event, node: node});
          }
        } else {
          if (this.isSingleSelectionMode()) {
            if (selected) {
              this.selection = null;
              this.onNodeUnselect.emit({originalEvent: event, node: node});
            } else {
              this.selection = node;
              this.onNodeSelect.emit({originalEvent: event, node: node});
            }
          } else {
            if (selected) {
              this.selection = this.selectionAsArray.filter((val, i) => i !== index);
              this.onNodeUnselect.emit({originalEvent: event, node: node});
            } else {
              this.selection = [...this.selectionAsArray || [], node];
              this.onNodeSelect.emit({originalEvent: event, node: node});
            }
          }

          this.selectionChange.emit(this.selection);
        }
      }
    }
  }

  onDoubleNodeClick(event: MouseEvent, node: ITreeNode): void {
    this.onNodeEdit.emit(node);
  }

  findIndexInSelection(node: ITreeNode): number {
    let index: number = -1;
    if (this.selectionMode && this.selection) {
      if (this.isSingleSelectionMode()) {
        index = (this.selection === node || node.id === (this.selection as ITreeNode).id) ? 0 : -1;
      } else {
        for (let i = 0; i < this.selectionAsArray.length; i++) {
          if (this.selection[i] === node || node.id === this.selection[i].id) {
            index = i;
            break;
          }
        }
      }
    }
    return index;
  }

  propagateUp(node: ITreeNode, select: boolean): void {
    if (node.children && node.children.length) {
      let selectedCount = 0;
      let childPartialSelected = false;
      for (const child of node.children) {
        if (this.isSelected(child)) {
          selectedCount++;
        } else if (child.partialSelected) {
          childPartialSelected = true;
        }
      }

      if (select && selectedCount === node.children.length) {
        this.selection = [...this.selectionAsArray || [], node];
        node.partialSelected = false;
      } else {
        if (!select) {
          const index = this.findIndexInSelection(node);
          if (index >= 0) {
            this.selection = this.selectionAsArray.filter((val, i) => i !== index);
          }
        }

        if (childPartialSelected || selectedCount > 0 && selectedCount !== node.children.length) {
          node.partialSelected = true;
        } else {
          node.partialSelected = false;
        }
      }
    }

    const {parent} = node;
    if (parent) {
      this.propagateUp(parent, select);
    }
  }

  propagateDown(node: ITreeNode, select: boolean): void {
    const index = this.findIndexInSelection(node);
    if (select && index === -1) {
      this.selection = [...this.selectionAsArray || [], node];
    } else if (!select && index > -1) {
      this.selection = this.selectionAsArray.filter((val, i) => i !== index);
    }
    node.partialSelected = false;
    if (node.children && node.children.length) {
      for (const child of node.children) {
        this.propagateDown(child, select);
      }
    }
  }

  isSelected(node: ITreeNode): boolean {
    return this.findIndexInSelection(node) !== -1;
  }

  isSingleSelectionMode(): boolean {
    return this.selectionMode && this.selectionMode === 'single';
  }

  isMultipleSelectionMode(): boolean {
    return this.selectionMode && this.selectionMode === 'multiple';
  }

  isCheckboxSelectionMode(): boolean {
    return this.selectionMode && this.selectionMode === 'checkbox';
  }

  changeLocation(payload: IDragAndDropPayload): void {
    const targetElement: ITreeNode = this.findNodeRecursively(this.value[0], payload.target);
    const sourceElement: ITreeNode = this.findNodeRecursively(this.value[0], payload.source);

    if (this.findNodeRecursively(sourceElement, payload.target)) {
      // User can not move the node under its child
      return;
    }

    const sourceParentElement: ITreeNode = sourceElement.parent;
    sourceParentElement.children = sourceParentElement.children.filter((node: ITreeNode) => node !== sourceElement);

    if (!sourceParentElement.children.length) {
      delete sourceParentElement.children;
      sourceParentElement.expanded = false;
    }

    if (payload.swap) {
      const targetParent: ITreeNode = targetElement.parent;
      targetParent.children = R.insert(
        R.findIndex((node: ITreeNode) => node === targetElement, targetParent.children) + 1,
        sourceElement,
        targetParent.children
      );
      sourceElement.parent = targetParent;
    } else {
      targetElement.children = R.insert(
        (targetElement.children || []).length, sourceElement, targetElement.children || []
      );
      sourceElement.parent = targetElement;
    }

    const payloads: ITreeNodeInfo[] = R.addIndex(R.map)((node: ITreeNode, index: number) => {
      return { id: node.id, parentId: node.parent.id, sortOrder: index + 1 };
    }, (payload.swap ? targetElement : sourceElement).parent.children);

    this.changeNodesLocation.emit(payloads);
  }

  findNodeRecursively(node: ITreeNode, id: string): ITreeNode {
    if (node.id === parseInt(id, 10)) {
      return node;
    }
    if (node.children) {
      let result: ITreeNode;
      node.children.forEach((childNode: ITreeNode) => {
        const currentNode: ITreeNode = this.findNodeRecursively(childNode, id);
        if (currentNode) {
          result = currentNode;
        }
      });
      return result;
    }
    return null;
  }
}
