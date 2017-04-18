// Official site at https://www.primefaces.org/primeng/#/tree
import {
  Component,
  Input,
  OnDestroy,
  EventEmitter,
  OnInit,
  EmbeddedViewRef,
  ViewContainerRef,
  TemplateRef } from '@angular/core';
import { TreeNode } from './common/api';
import { TreeDragDropService } from './common/treedragdrop.service';
import { PrimeTemplate, SharedModule } from './common/shared';

@Component({
  selector: 'app-tree-node-template-loader',
  template: ``
})
export class TreeNodeTemplateLoaderComponent implements OnInit, OnDestroy {

  @Input() node: any;

  @Input() template: TemplateRef<any>;

  view: EmbeddedViewRef<any>;

  constructor(public viewContainer: ViewContainerRef) {}

  ngOnInit() {
    this.view = this.viewContainer.createEmbeddedView(this.template, {
      '\$implicit': this.node
    });
  }

  ngOnDestroy() {
    this.view.destroy();
  }
}
