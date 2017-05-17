import {
  Component,
  Input,
  AfterContentInit,
  Output,
  EventEmitter,
  ContentChildren,
  QueryList,
  TemplateRef,
  ViewEncapsulation, HostListener, Renderer2
} from '@angular/core';

import { DragulaService } from 'ng2-dragula';

import { TreeNode } from './common/api';
import { PrimeTemplate } from './common/shared';
import { ITreeNodeDragAndDropPayload, INodeOffset } from './tree.interface';
import { DomHandler } from './dom/domhandler';

@Component({
  selector: 'app-tree',
  styleUrls: ['./tree.component.scss'],
  templateUrl: './tree.component.html',
  encapsulation: ViewEncapsulation.None
})
export class TreeComponent implements AfterContentInit {

  @Input() value: TreeNode[];
  @Input() selectionMode: string;
  @Input() selection: any;
  @Output() selectionChange: EventEmitter<any> = new EventEmitter();
  @Output() onNodeSelect: EventEmitter<any> = new EventEmitter();
  @Output() onNodeUnselect: EventEmitter<any> = new EventEmitter();
  @Output() onNodeExpand: EventEmitter<any> = new EventEmitter();
  @Output() onNodeCollapse: EventEmitter<any> = new EventEmitter();
  @Output() onNodeContextMenuSelect: EventEmitter<any> = new EventEmitter();
  @Output() changeLocation: EventEmitter<ITreeNodeDragAndDropPayload> = new EventEmitter();
  @Input() style: any;
  @Input() styleClass: string;
  @Input() contextMenu: any;
  @Input() layout = 'vertical';
  @Input() metaKeySelection = true;
  @Input() propagateSelectionUp = true;
  @Input() propagateSelectionDown = true;
  @ContentChildren(PrimeTemplate) templates: QueryList<any>;

  public templateMap: any;

  private _clientX: number;
  private _clientY: number;
  private _mirrorPosition: INodeOffset;
  private _isPutted: boolean;

  get horizontal(): boolean {
    return this.layout === 'horizontal';
  }

  constructor(private dragulaService: DragulaService,
              private domHandler: DomHandler,
              private renderer2: Renderer2) {

    dragulaService.drag.subscribe(() => {
      this._isPutted = false;
    });

      dragulaService.dragend.subscribe((value) => {
        const attr = value[1].getAttribute('nodeid');
        this.renderer2.removeChild(value[1].parentNode, value[1]);

        if (this._isPutted) {
          return;
        }

        const elements: HTMLCollectionOf<Element> = document.getElementsByClassName('ui-treenode-content');

        const a = [];

        Array.prototype.forEach.call(elements, (el) => {
          // Do stuff here
         // console.log(el.tagName);
          const elPos = this.domHandler.getOffset(el);
          const x1 = elPos.left;
          const x2 = elPos.left + elPos.width;
          const y1 = elPos.top;
          const y2 = elPos.top + elPos.height;

          if (this._mirrorPosition) {
            const x1Mirror = this._mirrorPosition.left;
            const x2Mirror = this._mirrorPosition.left + this._mirrorPosition.width;
            const y1Mirror = this._mirrorPosition.top;
            const y2Mirror = this._mirrorPosition.top + this._mirrorPosition.height;

            if ((x1 <= x1Mirror && x1Mirror <= x2 && y1 <= y1Mirror && y1Mirror <= y2) ||
              (x1 <= x2Mirror && x2Mirror <= x2 && y1 <= y1Mirror && y1Mirror <= y2) ||
              (x1 <= x1Mirror && x1Mirror <= x2 && y1 <= y2Mirror && y2Mirror <= y2) ||
              (x1 <= x2Mirror && x2Mirror <= x2 && y1 <= y2Mirror && y2Mirror <= y2)) {
             // console.log('OK: ', elPos.nodeId);
              a.push(el.getAttribute('nodeid'));
            }
          }
        });

        if (a.length === 2) {
          console.log('ARRAY: ', a);

          this.changeLocation.emit({
            swap: true,
            target: a[0],
            source: attr
          });
        }


      });
      dragulaService.drop.subscribe((value) => {
        this._mirrorPosition = this.domHandler.getOffset(document.getElementsByClassName('gu-mirror')[0]);

        if (value[1] && value[2]) {
          this.changeLocation.emit({
            swap: false,
            source: value[1].getAttribute('nodeid'),
            target: value[2].getAttribute('nodeid')
          });

          this._isPutted = true;
        }
      });
    }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    this._clientX = event.clientX;
    this._clientY = event.clientY;
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
