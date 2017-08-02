import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  Input,
  OnInit,
  ReflectiveInjector,
  ViewChild,
  ViewContainerRef
} from '@angular/core';

import { INode } from './container.interface';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContainerComponent implements OnInit, AfterViewInit {
  @Input() node: INode;

  @ViewChild('container', { read: ViewContainerRef }) container: ViewContainerRef;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private resolver: ComponentFactoryResolver,
  ) { }

  ngOnInit(): void {
    if (this.node.children) {
      return;
    }

    const inputs = Object.keys(this.node.inject || {})
      .map(key => ({
        provide: key,
        useValue: this.node.inject[key]
      }));

    const injector = ReflectiveInjector.fromResolvedProviders(ReflectiveInjector.resolve(inputs), this.container.parentInjector);

    const component = this.resolver.resolveComponentFactory(this.node.component).create(injector);
    this.container.insert(component.hostView);
  }

  ngAfterViewInit(): void {
    this.changeDetectorRef.markForCheck();
  }
}
