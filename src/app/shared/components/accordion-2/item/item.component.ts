import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';

import { Accordion2Service } from '../accordion-2.service';

@Component({
  selector: 'app-accordion-2-item',
  templateUrl: 'item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Accordion2ItemComponent {
  @Input() clickable = true;
  @Input() title: string;

  private _display = false;

  constructor(
    private accordion2Service: Accordion2Service,
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
