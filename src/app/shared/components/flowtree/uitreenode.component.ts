import {
  Component,
  OnInit,
  Input,
  Inject,
  forwardRef,
} from '@angular/core';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/combineLatest';

import { TreeNode } from './common/api';
import { TreeComponent } from './tree.component';
import { ClickComponentPlugin } from './click.component.plugin';
import {
  IClickableComponent,
  IClickableComponentPlugin
} from './tree.interface';

@Component({
  selector: 'app-tree-node',
  templateUrl: './uitreenode.component.html'
})
export class UITreeNodeComponent implements OnInit, IClickableComponent {

  static DEFAULT_BG_COLOR = '#fff';
  static DEFAULT_SELECTED_BG_COLOR = '#def';

  @Input() node: TreeNode;
  @Input() parentNode: TreeNode;
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
      this.node.selectedBgColor || UITreeNodeComponent.DEFAULT_SELECTED_BG_COLOR :
      this.node.bgColor || UITreeNodeComponent.DEFAULT_BG_COLOR;
  }

  isLeaf(): boolean {
    return !(this.node.children && this.node.children.length);
  }

  toggle(event: Event): void {
    this.stopEvent(event);
    if (this.node.expanded) {
      this.tree.onNodeCollapse.emit({originalEvent: event, node: this.node});
    } else {
      this.tree.onNodeExpand.emit({originalEvent: event, node: this.node});
    }
    this.node.expanded = !this.node.expanded;
  }

  onClick(event: MouseEvent): void {
    this.tree.onNodeClick(event, this.node);
  }

  onDoubleClick(event: MouseEvent): void {
    this.tree.onDoubleNodeClick(event, this.node);
  }

  delegateClick(event: MouseEvent): void {
    this.stopEvent(event);
    this.clickComponentPlugin.delegateClick(event);
  }

  isSelected(): boolean {
    return this.tree.isSelected(this.node);
  }

  getIcon(): string {
    return this.node.expanded
      ? this.node.expandedIcon
      : (this.node.icon || this.node.collapsedIcon);
  }

  private stopEvent($event: Event): void {
    $event.stopPropagation();
    $event.preventDefault();
  }
}
