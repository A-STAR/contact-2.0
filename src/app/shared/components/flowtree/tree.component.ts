import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  Renderer2,
  ViewEncapsulation,
} from '@angular/core';
import * as R from 'ramda';

import { DragAndDropComponentPlugin, DragAndDropComponentPluginFactory } from '../dnd/drag-and-drop.component.plugin';

import { IDragAndDropPayload, IDragAndDropView } from '../dnd/drag-and-drop.interface';
import { ITreeNode, ITreeNodeInfo } from './treenode/treenode.interface';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'app-tree',
  styleUrls: [ './styles.scss', './tree.component.scss' ],
  templateUrl: './tree.component.html',
})
export class TreeComponent implements IDragAndDropView, OnDestroy {
  @Input() canPaste = false;
  @Input() dblClickEnabled = true;
  @Input() collapseAdjacentNodes = false;
  @Input() expandNodeOnClick = false;
  @Input() value: ITreeNode[];
  @Input() selectionMode: string;
  @Input() selection: ITreeNode|ITreeNode[];
  @Output() selectionChange: EventEmitter<any> = new EventEmitter();
  @Output() onNodeSelect: EventEmitter<any> = new EventEmitter();
  @Output() onNodeUnselect: EventEmitter<any> = new EventEmitter();
  @Output() onNodeExpand: EventEmitter<any> = new EventEmitter();
  @Output() onNodeCollapse: EventEmitter<any> = new EventEmitter();
  @Output() onNodeDblClick: EventEmitter<any> = new EventEmitter();
  @Output() changeNodesLocation: EventEmitter<ITreeNodeInfo[]> = new EventEmitter<ITreeNodeInfo[]>();
  @Output() copy = new EventEmitter<ITreeNode>();
  @Output() paste = new EventEmitter<ITreeNode>();
  @Output() nodeMove = new EventEmitter<ITreeNodeInfo>();
  @Input() style: any;
  @Input() styleClass: string;
  @Input() layout = 'vertical';
  @Input() metaKeySelection = true;
  @Input() propagateSelectionUp = true;
  @Input() propagateSelectionDown = true;

  @Input()
  set dndEnabled(dndEnabled: boolean) {
    if (dndEnabled) {
      this.dragAndDropPlugin = this.dragAndDropComponentPluginFactory.attachTo(this, {
        viewElementRef: this.elementRef,
        draggableNodesSelector: '.app-treenode-content',
        renderer: this.renderer
      });
      if (this.dragAndDropPlugin && this.dragAndDropPlugin.ngOnDestroy) {
        this.dragAndDropPlugin.ngOnInit();
      }
    } else {
      if (this.dragAndDropPlugin && this.dragAndDropPlugin.ngOnDestroy) {
        this.dragAndDropPlugin.ngOnDestroy();
      }
      this.dragAndDropPlugin = null;
    }
  }

  @Input('contextMenuEnabled')
  set contextMenuEnabled(contextMenuEnabled: boolean) {
    this._ctxMenuEnabled = contextMenuEnabled;
    if (contextMenuEnabled) {
      this._clickListener = this.renderer.listen('document', 'click', () => this.hideMenu());
      this._wheelListener = this.renderer.listen('document', 'wheel', () => this.hideMenu());
    } else {
      this.removeListeners();
    }
  }

  private dragAndDropPlugin: DragAndDropComponentPlugin;
  private _ctxMenuEnabled = false;
  private _ctxMenu: { node: ITreeNode, style: { left: string, top: string } } = null;
  private _clickListener: Function;
  private _wheelListener: Function;

  get ctxMenu(): any {
    return this._ctxMenu;
  }

  get horizontal(): boolean {
    return this.layout === 'horizontal';
  }

  get selectionAsArray(): ITreeNode[] {
    return this.selection as ITreeNode[];
  }

  get dragulaOptions(): any {
    return this.dragAndDropPlugin
      ? this.dragAndDropPlugin.dragulaOptions
      : null;
  }

  constructor(
    private cdRef: ChangeDetectorRef,
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private dragAndDropComponentPluginFactory: DragAndDropComponentPluginFactory
  ) {}

  ngOnDestroy(): void {
    this.removeListeners();
  }

  hideMenu(): void {
    this._ctxMenu = null;
    this.cdRef.markForCheck();
  }

  onContextMenu(event: MouseEvent, node: ITreeNode): void {
    event.preventDefault();
    if (this._ctxMenuEnabled) {
      this._ctxMenu = {
        node,
        style: {
          left: `${event.pageX}px`,
          top: `${event.pageY}px`,
        },
      };
    }
  }

  onCopyClick(copyChildren: boolean): void {
    const { children, ...rest } = this._ctxMenu.node;
    this.copy.emit({
      ...rest,
      children: copyChildren ? children : null
    });
  }

  onPasteClick(): void {
    this.paste.emit(this._ctxMenu.node);
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
            this.selection = this.selectionAsArray.filter((_, i) => i !== index);
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
          this.nodeSelect(event, node);
        }
      } else {
        const metaSelection = this.metaKeySelection;

        if (metaSelection) {
          const metaKey = (event.metaKey || event.ctrlKey);

          if (selected && metaKey) {
            if (this.isSingleSelectionMode()) {
              this.selectionChange.emit(null);
            } else {
              this.selection = this.selectionAsArray.filter((_, i) => i !== index);
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
            this.nodeSelect(event, node);
          }
        } else {
          if (this.isSingleSelectionMode()) {
            if (selected) {
              this.selection = null;
              this.onNodeUnselect.emit({originalEvent: event, node: node});
            } else {
              this.selection = node;
              this.nodeSelect(event, node);
            }
          } else {
            if (selected) {
              this.selection = this.selectionAsArray.filter((_, i) => i !== index);
              this.onNodeUnselect.emit({originalEvent: event, node: node});
            } else {
              this.selection = [...this.selectionAsArray || [], node];
              this.nodeSelect(event, node);
            }
          }

          this.selectionChange.emit(this.selection);
        }
      }
    }
  }

  onDoubleNodeClick(_: MouseEvent, node: ITreeNode): void {
    if (this.dblClickEnabled) {
      this.onNodeDblClick.emit(node);
    }
  }

  findIndexInSelection(node: ITreeNode): number {
    let index = -1;
    if (this.selectionMode && this.selection) {
      if (this.isSingleSelectionMode()) {
        index = this.selection === node ? 0 : -1;
      } else {
        for (let i = 0; i < this.selectionAsArray.length; i++) {
          if (this.selection[i] === node) {
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
            this.selection = this.selectionAsArray.filter((_, i) => i !== index);
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
      this.selection = this.selectionAsArray.filter((_, i) => i !== index);
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
    const targetElement = this.findNodeRecursively(this.value[0], payload.targetId);
    const sourceElement = this.findNodeRecursively(this.value[0], payload.sourceId);

    if (this.findNodeRecursively(sourceElement, payload.targetId)) {
      // User cannot move the node under its child
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

    const payloads: ITreeNodeInfo[] = R.addIndex(R.map as any)((node: ITreeNode, index: number) => {
      return { id: node.id, parentId: node.parent.id, sortOrder: index + 1 };
    }, (payload.swap ? targetElement : sourceElement).parent.children) as any;

    const nodeMoveEventPayload = payloads.find(p => p.id === Number(payload.sourceId));
    this.nodeMove.emit(nodeMoveEventPayload);
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

  nodeCollapse(event: MouseEvent, node: ITreeNode): void {
    this.onNodeCollapse.emit({originalEvent: event, node: node});
  }

  nodeExpand(event: MouseEvent, node: ITreeNode): void {
    this.onNodeExpand.emit({originalEvent: event, node: node});
  }

  private nodeSelect(event: MouseEvent, node: ITreeNode): void {
    this.onNodeSelect.emit({originalEvent: event, node: node});
  }

  private removeListeners(): void {
    if (this._clickListener) {
      this._clickListener();
    }
    if (this._wheelListener) {
      this._wheelListener();
    }
  }
}
