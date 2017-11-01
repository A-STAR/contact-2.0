import { AfterViewInit, ChangeDetectionStrategy, Component, ContentChildren, QueryList } from '@angular/core';

import { AccordionService } from './accordion.service';

import { AccordionItemComponent } from './item/item.component';

@Component({
  selector: 'app-accordion',
  templateUrl: 'accordion.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    AccordionService,
  ]
})
export class AccordionComponent implements AfterViewInit {
  @ContentChildren(AccordionItemComponent) items: QueryList<AccordionItemComponent>;

  constructor(
    private accordion2Service: AccordionService,
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
