import {
  AfterViewInit,
  Component,
  ComponentRef,
  ChangeDetectorRef,
  OnChanges,
  OnDestroy,
  Input,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';

import { ITab } from './content-tab.interface';

@Component({
  selector: 'app-content-tab',
  template: `<ng-container #target></ng-container>`
})
export class ContentTabComponent implements AfterViewInit, OnChanges, OnDestroy {
  @ViewChild('target', {read: ViewContainerRef}) target;
  @Input() tab: ITab;
  compRef: ComponentRef<any>;
  private isViewInitialized = false;

  constructor(private cdRef: ChangeDetectorRef) { }

  updateComponent(): void {
    if (!this.isViewInitialized) {
      return;
    }
    this.cdRef.detectChanges();
  }

  ngOnChanges(): void {
    this.updateComponent();
  }

  ngAfterViewInit(): void {
    this.isViewInitialized = true;
    if (this.compRef) {
      this.compRef.destroy();
    }

    const { factory, injector } = this.tab;

    // console.log('target length before', this.target.length);
    this.compRef = this.target.createComponent(factory, this.target.length, injector, []);
    // console.log('target length after', this.target.length);
    // this.compRef.instance.title = this.title;
    // this.compRef.instance.someOutput.subscribe(val => console.log(val));

    // this.cdRef.detectChanges();

    this.updateComponent();
  }

  ngOnDestroy(): void {
    if (this.compRef) {
      this.compRef.destroy();
    }
  }
}