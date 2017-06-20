import {
  Component,
  OnInit,
  Input,
  Inject,
  forwardRef,
} from '@angular/core';

import { TreeComponent } from '../tree.component';
import { ClickComponentPlugin } from './click.component.plugin';

import { ITreeNode } from './treenode.interface';
import { IClickableComponent, IClickableComponentPlugin } from '../tree.interface';

@Component({
  selector: 'app-tree-node',
  templateUrl: './treenode.component.html'
})
export class TreeNodeComponent implements OnInit, IClickableComponent {

  static DEFAULT_BG_COLOR = '#fff';
  static DEFAULT_SELECTED_BG_COLOR = '#def';

  @Input() node: ITreeNode;
  @Input() parentNode: ITreeNode;
  @Input() root: boolean;
  @Input() index: number;
  @Input() firstChild: boolean;
  @Input() lastChild: boolean;

  private clickComponentPlugin: IClickableComponentPlugin;

  constructor(@Inject(forwardRef(() => TreeComponent)) public tree: TreeComponent) {
    this.clickComponentPlugin = new ClickComponentPlugin(this);
  }

  get dragulaOptions(): any {
    return this.tree.dragulaOptions;
  }

  ngOnInit(): void {
    if (typeof this.parentNode !== 'undefined') {
      this.node.parent = this.parentNode;
    }
  }

  getBgColor(): string {
    return this.isSelected() ?
      this.node.selectedBgColor || TreeNodeComponent.DEFAULT_SELECTED_BG_COLOR :
      this.node.bgColor || TreeNodeComponent.DEFAULT_BG_COLOR;
  }

  isLeaf(): boolean {
    return !(this.node.children && this.node.children.length);
  }

  toggle(event: MouseEvent): void {
    this.stopEvent(event);
    if (this.node.expanded) {
      this.tree.onNodeCollapse.emit({originalEvent: event, node: this.node});
    } else {
      this.tree.onNodeExpand.emit({originalEvent: event, node: this.node});
    }
    this.node.expanded = !this.node.expanded;
  }

  toggleDbClick(event: MouseEvent): void {
    this.stopEvent(event);
  }

  onClick(event: MouseEvent): void {
    this.tree.onNodeClick(event, this.node);
  }

  onDoubleClick(event: MouseEvent): void {
    this.tree.onDoubleNodeClick(event, this.node);
  }

  delegateClick(event: MouseEvent): void {
    this.clickComponentPlugin.delegateClick(event);
  }

  stopEvent(event: MouseEvent): void {
    this.clickComponentPlugin.stopEvent(event);
  }

  isSelected(): boolean {
    return this.tree.isSelected(this.node);
  }

  getIcon(): string {
    return this.node.expanded
      ? this.node.expandedIcon
      : (this.node.icon || this.node.collapsedIcon);
  }

  canShowConnector(): boolean {
    return this.node.parent.children.length > 1;
  }
}
