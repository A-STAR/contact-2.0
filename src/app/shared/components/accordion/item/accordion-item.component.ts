import { Component, Input, animate, style, transition, trigger } from '@angular/core';

import { AccordionComponent } from '../accordion.component';

@Component({
  selector: 'app-accordion-item',
  templateUrl: './accordion-item.component.html',
  styleUrls: [ './accordion-item.component.scss' ],
  animations: [
    trigger(
      'isCollapsed', [
        transition(':enter', [
          style({ height: '0', overflow: 'hidden' }),
          animate('150ms ease', style({ height: '*' }))
        ]),
        transition(':leave', [
          style({ height: '*', overflow: 'hidden' }),
          animate('150ms ease', style({ height: '0' }))
        ]),
      ]
    )
  ]
})
export class AccordionItemComponent {
  @Input() title: string;

  private _isCollapsed = true;

  constructor(private accordion: AccordionComponent) {
    this.accordion.addTab(this);
  }

  get isCollapsed(): boolean {
    return this._isCollapsed;
  }

  onClick(): void {
    const isCollapsed = this.isCollapsed;
    this.accordion.tabs.forEach(tab => tab.hide());
    this.toggle(!isCollapsed);
  }

  toggle(isCollapsed: boolean): void {
    this._isCollapsed = isCollapsed === undefined ? !this._isCollapsed : isCollapsed;
  }

  hide(): void {
    this._isCollapsed = true;
  }
}
