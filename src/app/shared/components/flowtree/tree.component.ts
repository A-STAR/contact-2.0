import {
  Component,
  Input,
  AfterContentInit,
  Output,
  EventEmitter,
  ContentChildren,
  QueryList,
  TemplateRef,
  ViewEncapsulation,
  HostListener,
  ElementRef,
  OnInit,
  OnDestroy,
} from '@angular/core';

import { TreeNode } from './common/api';
import { PrimeTemplate } from './common/shared';
import { DragAndDropComponentPlugin, DragAndDropComponentPluginFactory } from '../dnd/drag-and-drop.component.plugin';
import { IDragAndDropPayload, IDraggedComponent } from '../dnd/drag-and-drop.interface';

@Component({
  selector: 'app-tree',
  styleUrls: ['./tree.component.scss'],
  templateUrl: './tree.component.html',
  encapsulation: ViewEncapsulation.None
})
export class TreeComponent implements IDraggedComponent, OnInit, OnDestroy, AfterContentInit {

  @Input() value: TreeNode[];
  @Input() selectionMode: string;
  @Input() selection: any;
  @Output() selectionChange: EventEmitter<any> = new EventEmitter();
  @Output() onNodeSelect: EventEmitter<any> = new EventEmitter();
  @Output() onNodeUnselect: EventEmitter<any> = new EventEmitter();
  @Output() onNodeExpand: EventEmitter<any> = new EventEmitter();
  @Output() onNodeCollapse: EventEmitter<any> = new EventEmitter();
  @Output() onNodeContextMenuSelect: EventEmitter<any> = new EventEmitter();
  @Output() changeLocation: EventEmitter<IDragAndDropPayload> = new EventEmitter();
  @Input() style: any;
  @Input() styleClass: string;
  @Input() contextMenu: any;
  @Input() layout = 'vertical';
  @Input() metaKeySelection = true;
  @Input() propagateSelectionUp = true;
  @Input() propagateSelectionDown = true;
  @Input() dragulaOptions: any;
  @ContentChildren(PrimeTemplate) templates: QueryList<any>;

  public templateMap: any;
  private dragAndDropPlugin: DragAndDropComponentPlugin;

  get horizontal(): boolean {
    return this.layout === 'horizontal';
  }

  get elementSelector(): string {
    return '.ui-treenode-content';
  }

  constructor(public elementRef: ElementRef,
              dragAndDropComponentPluginFactory: DragAndDropComponentPluginFactory) {
    this.dragAndDropPlugin = dragAndDropComponentPluginFactory.createAndAttachTo(this);
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    this.dragAndDropPlugin.onMouseMove(event);
  }

  ngOnInit(): void {
    this.dragAndDropPlugin.ngOnInit();
  }

  ngOnDestroy(): void {
    this.dragAndDropPlugin.ngOnDestroy();
  }

  ngAfterContentInit(): void {
    if (this.templates.length) {
      this.templateMap = {};
    }
    this.templates.forEach((item) => this.templateMap[item.getType()] = item.template);
  }

  onNodeClick(event: MouseEvent, node: TreeNode): void {
    const eventTarget = (<Element> event.target);

    if (eventTarget.className && eventTarget.className.indexOf('ui-tree-toggler') === 0) {
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
            this.selection = this.selection.filter((val, i) => i !== index);
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
            this.selection = [...this.selection || [], node];
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
              this.selection = this.selection.filter((val, i) => i !== index);
              this.selectionChange.emit(this.selection);
            }

            this.onNodeUnselect.emit({originalEvent: event, node: node});
          } else {
            if (this.isSingleSelectionMode()) {
              this.selectionChange.emit(node);
            } else if (this.isMultipleSelectionMode()) {
              this.selection = (!metaKey) ? [] : this.selection || [];
              this.selection = [...this.selection, node];
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
              this.selection = this.selection.filter((val, i) => i !== index);
              this.onNodeUnselect.emit({originalEvent: event, node: node});
            } else {
              this.selection = [...this.selection || [], node];
              this.onNodeSelect.emit({originalEvent: event, node: node});
            }
          }

          this.selectionChange.emit(this.selection);
        }
      }
    }
  }

  onNodeRightClick(event: MouseEvent, node: TreeNode): void {
    if (this.contextMenu) {
      const eventTarget = (<Element> event.target);

      if (eventTarget.className && eventTarget.className.indexOf('ui-tree-toggler') === 0) {
        return;
      } else {
        const index = this.findIndexInSelection(node);
        const selected = (index >= 0);

        if (!selected) {
          if (this.isSingleSelectionMode()) {
            this.selectionChange.emit(node);
          } else {
            this.selectionChange.emit([node]);
          }
        }

        this.contextMenu.show(event);
        this.onNodeContextMenuSelect.emit({originalEvent: event, node: node});
      }
    }
  }

  findIndexInSelection(node: TreeNode): number {
    let index: number = -1;
    if (this.selectionMode && this.selection) {
      if (this.isSingleSelectionMode()) {
        index = (this.selection === node) ? 0 : -1;
      } else {
        for (let i = 0; i < this.selection.length; i++) {
          if (this.selection[i] === node) {
            index = i;
            break;
          }
        }
      }
    }
    return index;
  }

  propagateUp(node: TreeNode, select: boolean): void {
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
        this.selection = [...this.selection || [], node];
        node.partialSelected = false;
      } else {
        if (!select) {
          const index = this.findIndexInSelection(node);
          if (index >= 0) {
            this.selection = this.selection.filter((val, i) => i !== index);
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

  propagateDown(node: TreeNode, select: boolean): void {
    const index = this.findIndexInSelection(node);
    if (select && index === -1) {
      this.selection = [...this.selection || [], node];
    } else if (!select && index > -1) {
      this.selection = this.selection.filter((val, i) => i !== index);
    }
    node.partialSelected = false;
    if (node.children && node.children.length) {
      for (const child of node.children) {
        this.propagateDown(child, select);
      }
    }
  }

  isSelected(node: TreeNode): boolean {
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

  getTemplateForNode(node: TreeNode): TemplateRef<any> {
    if (this.templateMap) {
      return node.type ? this.templateMap[node.type] : this.templateMap['default'];
    } else {
      return null;
    }
  }
}
