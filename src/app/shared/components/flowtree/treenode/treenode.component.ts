import { Component, Input, Inject, OnDestroy, forwardRef } from '@angular/core';

import { TreeComponent } from '../tree.component';
import { ClickComponentPlugin } from './click.component.plugin';

import { ITreeNode } from './treenode.interface';
import { IClickableComponent, IClickableComponentPlugin } from '../tree.interface';

@Component({
  selector: 'app-tree-node',
  templateUrl: './treenode.component.html'
})
export class TreeNodeComponent implements OnDestroy, IClickableComponent {
  static DEFAULT_BG_COLOR = '#fff';

  @Input() collapseAdjacentNodes = false;
  @Input() expandNodeOnClick = false;
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

  ngOnDestroy(): void {
    this.clickComponentPlugin.ngOnDestroy();
  }

  getBgColor(): string {
    return this.node.bgColor || TreeNodeComponent.DEFAULT_BG_COLOR;
  }

  isLeaf(): boolean {
    return !(this.node.children && this.node.children.length);
  }

  toggle(event: MouseEvent): void {
    this.stopEvent(event);
    if (this.node.expanded) {
      this.doCollapseChildren(this.node);
      this.tree.nodeCollapse(event, this.node);
    } else {
      this.doCollapseAdjacentNodes();
      this.tree.nodeExpand(event, this.node);
    }
    this.node.expanded = !this.node.expanded;
  }

  toggleDbClick(event: MouseEvent): void {
    this.stopEvent(event);
  }

  onClick(event: MouseEvent): void {
    this.doExpandNodeOnClick();
    this.tree.onNodeClick(event, this.node);
  }

  onDoubleClick(event: MouseEvent): void {
    this.tree.onDoubleNodeClick(event, this.node);
  }

  onContextMenu(event: MouseEvent): void {
    this.tree.onContextMenu(event, this.node);
  }

  delegateClick(event: MouseEvent): void {
    this.clickComponentPlugin.delegateClick(event);
  }

  stopEvent(event: MouseEvent): void {
    event.stopPropagation();
    event.preventDefault();
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

  private doExpandNodeOnClick(): void {
    if (this.expandNodeOnClick && !this.node.expanded) {
      this.setNodeExpanded(this.node);
      this.doCollapseAdjacentNodes();
    }
  }

  private doCollapseAdjacentNodes(): void {
    if (this.collapseAdjacentNodes && this.node.parent) {
      this.node.parent.children
        .filter(node => node !== this.node)
        .forEach(node => {
          node.expanded = false;
          this.doCollapseChildren(node);
        });
    }
  }

  private doCollapseChildren(node: ITreeNode): void {
    (node.children || []).forEach(childNode => {
      childNode.expanded = false;
      this.doCollapseChildren(childNode);
    });
  }

  private setNodeExpanded(node: ITreeNode): void  {
    if (node.children && node.children.length) {
      node.expanded = true;
    }
  }
}
