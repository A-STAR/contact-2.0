// Official site at https://www.primefaces.org/primeng/#/tree
import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  EmbeddedViewRef,
  ViewContainerRef,
  TemplateRef
} from '@angular/core';

@Component({
  selector: 'app-tree-node-template-loader',
  template: ``
})
export class TreeNodeTemplateLoaderComponent implements OnInit, OnDestroy {

  @Input() node: any;

  @Input() template: TemplateRef<any>;

  view: EmbeddedViewRef<any>;

  constructor(public viewContainer: ViewContainerRef) {}

  ngOnInit(): void {
    this.view = this.viewContainer.createEmbeddedView(this.template, {
      '\$implicit': this.node
    });
  }

  ngOnDestroy(): void {
    this.view.destroy();
  }
}
