import { AfterViewInit, ChangeDetectionStrategy, Component, ContentChildren, QueryList } from '@angular/core';

import { Accordion2Service } from './accordion-2.service';

import { Accordion2ItemComponent } from './item/item.component';

@Component({
  selector: 'app-accordion-2',
  templateUrl: 'accordion-2.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    Accordion2Service,
  ]
})
export class Accordion2Component implements AfterViewInit {
  @ContentChildren(Accordion2ItemComponent) items: QueryList<Accordion2ItemComponent>;

  constructor(
    private accordion2Service: Accordion2Service,
  ) {}

  ngAfterViewInit(): void {
    this.accordion2Service.items = this.items;
  }

  prev(): void {
    this.accordion2Service.prev();
  }

  next(): void {
    this.accordion2Service.next();
  }
}
