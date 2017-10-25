import { Component, EventEmitter, Input, Output } from '@angular/core';

import { AccordionItemComponent } from './item/accordion-item.component';

@Component({
  selector: 'app-accordion',
  templateUrl: './accordion.component.html'
})
export class AccordionComponent {
  @Input('selectedIndex') set selectedIndex(selectedIndex: number) {
    this._tabs.forEach((tab, i) => tab.toggle(i !== selectedIndex));
  }

  @Output() selectedIndexChange = new EventEmitter<number>();

  private _tabs: AccordionItemComponent[] = [];

  get tabs(): AccordionItemComponent[] {
    return this._tabs;
  }

  addTab(item: AccordionItemComponent): void {
    this._tabs.push(item);
  }
}
