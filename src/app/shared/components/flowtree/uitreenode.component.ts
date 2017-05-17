import {Component, OnInit, Input, Inject, forwardRef} from '@angular/core';

import {TreeNode} from './common/api';
import {TreeComponent} from './tree.component';

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

  constructor(@Inject(forwardRef(() => TreeComponent)) public tree: TreeComponent) {
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
    this.tree.onNodeClick(event, this.node);
  }

  onNodeRightClick(event: MouseEvent): void {
    this.tree.onNodeRightClick(event, this.node);
  }

  isSelected(): boolean {
    return this.tree.isSelected(this.node);
  }
}
