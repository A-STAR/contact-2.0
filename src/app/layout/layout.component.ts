import { Component, HostListener } from '@angular/core';

import { HelpService } from '@app/core/help/help.service';
import { LayoutService } from './layout.service';

@Component({
  host: { class: 'full-size' },
  selector: 'app-layout',
  styleUrls: [ './layout.component.scss' ],
  templateUrl: './layout.component.html',
})
export class LayoutComponent {
  constructor(
    private helpService: HelpService,
    private layoutService: LayoutService,
  ) {}

  @HostListener('window:resize')
  onWindowResize(): void {
    this.layoutService.triggerContentDimensionChange();
  }

  @HostListener('window:keydown', [ '$event' ])
  onKeyPress(event: KeyboardEvent): void {
    const { key } = event;
    if (key === 'F1') {
      this.helpService.open(0);
      event.preventDefault();
    }
  }

  @HostListener('window:help', [ '$event' ])
  onHelp(event: KeyboardEvent): boolean {
    event.preventDefault();
    return false;
  }
}
