import { Component, Input } from '@angular/core';

import { AccordionComponent } from '../accordion.component';

@Component({
  selector: 'app-accordion-item',
  templateUrl: './accordion-item.component.html'
})
export class AccordionItemComponent {
  @Input() title: string;

  private isHidden = true;

  constructor(private accordion: AccordionComponent) {
    this.accordion.addTab(this);
  }

  onClick(): void {
    const isHidden = this.isHidden;
    this.accordion.tabs.forEach(tab => tab.hide());
    this.toggle(!isHidden);
  }

  toggle(isHidden: boolean): void {
    this.isHidden = isHidden === undefined ? !this.isHidden : isHidden;
  }

  hide(): void {
    this.isHidden = true;
  }
}
