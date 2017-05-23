import { Component, OnInit, Input, Inject, forwardRef, EventEmitter } from '@angular/core';
import 'rxjs/add/operator/debounceTime';

import { TreeNode } from './common/api';
import { TreeComponent } from './tree.component';

@Component({
  selector: 'app-tree-node',
  templateUrl: './uitreenode.component.html'
})
export class UITreeNodeComponent implements OnInit {

  static DEFAULT_BG_COLOR = '#fff';
  static DEFAULT_SELECTED_BG_COLOR = '#def';

  @Input() node: TreeNode;
  @Input() parentNode: TreeNode;
  @Input() root: boolean;
  @Input() index: number;
  @Input() firstChild: boolean;
  @Input() lastChild: boolean;
  @Input() dragulaOptions: any;

  click: EventEmitter<MouseEvent> = new EventEmitter();

  constructor(@Inject(forwardRef(() => TreeComponent)) public tree: TreeComponent) {
    /*
     * TODO:
     * 1. Break onNodeClick into two events: onNodeSelect (fires immediately) and onNodeExpand (debounced).
     * 2. Fire onDoubleNodeClick immediately after two clicks.
     */
    this.click
      .debounceTime(250)
      .subscribe(event => {
        this.tree.onNodeClick(event, this.node);
        if (event.detail > 1) {
          this.tree.onDoubleNodeClick(event, this.node);
        }
      });
  }

  ngOnInit(): void {
    if (typeof this.parentNode !== 'undefined') {
      this.node.parent = this.parentNode;
    }
    if (!this.dragulaOptions) {
      this.dragulaOptions = {
        invalid: () => true // prevent any drags from initiating by default
      };
    }
  }

  getBgColor(): string {
    return this.isSelected() ?
      this.node.selectedBgColor || UITreeNodeComponent.DEFAULT_SELECTED_BG_COLOR :
      this.node.bgColor || UITreeNodeComponent.DEFAULT_BG_COLOR;
  }

  isLeaf(): boolean {
    return !(this.node.children && this.node.children.length);
  }

  toggle(event: Event): void {
    if (this.node.expanded) {
      this.tree.onNodeCollapse.emit({originalEvent: event, node: this.node});
    } else {
      this.tree.onNodeExpand.emit({originalEvent: event, node: this.node});
    }

    this.node.expanded = !this.node.expanded;
  }

  onNodeClick(event: MouseEvent): void {
    this.click.emit(event);
  }

  onNodeRightClick(event: MouseEvent): void {
    this.tree.onNodeRightClick(event, this.node);
  }

  isSelected(): boolean {
    return this.tree.isSelected(this.node);
  }
}
