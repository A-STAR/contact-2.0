import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { IDynamicLayoutAttribute } from '../dynamic-layout.interface';

import { AttributeService } from '../attribute/attribute.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-dynamic-layout-attribute',
  templateUrl: 'attribute.component.html'
})
export class AttributeComponent implements OnInit, OnDestroy {
  @Input() attribute: IDynamicLayoutAttribute;

  value: any;

  private attributesSubscription: Subscription;

  constructor(
    private attributeService: AttributeService,
    private cdRef: ChangeDetectorRef,
  ) {}

  @HostBinding('style.flex')
  get flex(): string {
    return this.attribute.size
      ? `${this.attribute.size} 0`
      : `0 0 auto`;
  }

  get style(): Partial<CSSStyleDeclaration> {
    return {
      flex: this.attribute.size ? `${this.attribute.size} 0` : `0 0 auto`,
    };
  }

  ngOnInit(): void {
    this.attributesSubscription = this.attributeService.attributes$.subscribe(attributes => {
      this.value = attributes ? attributes[this.attribute.key] : null;
      this.cdRef.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.attributesSubscription.unsubscribe();
  }
}
