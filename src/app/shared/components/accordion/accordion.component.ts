import { Component } from '@angular/core';

import { AccordionItemComponent } from './item/accordion-item.component';

@Component({
  selector: 'app-accordion',
  templateUrl: './accordion.component.html'
})
export class AccordionComponent {
  private _tabs: Array<AccordionItemComponent> = [];

  get tabs(): Array<AccordionItemComponent> {
    return this._tabs;
  }

  addTab(item: AccordionItemComponent): void {
    this._tabs.push(item);
  }
}
