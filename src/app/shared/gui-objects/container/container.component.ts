import { Component, ComponentFactoryResolver, Input, OnInit, ReflectiveInjector, ViewChild, ViewContainerRef } from '@angular/core';

import { INode } from './container.interface';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html'
})
export class ContainerComponent implements OnInit {
  @Input() node: INode;

  @ViewChild('container', { read: ViewContainerRef }) container: ViewContainerRef;

  constructor(private resolver: ComponentFactoryResolver) { }

  ngOnInit(): void {
    if (this.node.children) {
      return;
    }

    const injector = ReflectiveInjector.fromResolvedProviders(
      ReflectiveInjector.resolve([{ provide: 'key', useValue: this.node.key }]),
      this.container.parentInjector
    );

    const component = this.resolver.resolveComponentFactory(this.node.component).create(injector);
    this.container.insert(component.hostView);
  }
}
