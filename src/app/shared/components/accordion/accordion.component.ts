import { Component } from '@angular/core';

import { AccordionItemComponent } from './item/accordion-item.component';

@Component({
  selector: 'app-accordion',
  templateUrl: './accordion.component.html'
})
export class AccordionComponent {
  private activeItemIndex = null;

  tabs: Array<AccordionItemComponent> = [];

  addTab(item: AccordionItemComponent): void {
    this.tabs.push(item);
  }
}
