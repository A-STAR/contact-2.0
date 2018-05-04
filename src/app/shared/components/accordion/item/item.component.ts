import { animate, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';

import { AccordionService } from '../accordion.service';

@Component({
  selector: 'app-accordion-item',
  templateUrl: 'item.component.html',
  styleUrls: [ 'item.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger(
      'display', [
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
  @Input() clickable = true;
  @Input() title: string;

  private _display = false;

  constructor(
    private accordion2Service: AccordionService,
    private cdRef: ChangeDetectorRef,
  ) {}

  get display(): boolean {
    return this._display;
  }

  set display(display: boolean) {
    this._display = display;
    this.cdRef.markForCheck();
  }

  onToggleClick(): void {
    if (this.clickable) {
      this.accordion2Service.toggle(this);
    }
  }
}
