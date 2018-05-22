import { Component, HostListener } from '@angular/core';
import { filter, first, map } from 'rxjs/operators';

import { HelpService } from '@app/core/help/help.service';
import { LayoutService } from './layout.service';
import { LayoutService as CoreLayoutService } from '@app/core/layout/layout.service';

@Component({
  host: { class: 'full-size' },
  selector: 'app-layout',
  styleUrls: [ './layout.component.scss' ],
  templateUrl: './layout.component.html',
})
export class LayoutComponent {
  constructor(
    private coreLayoutService: CoreLayoutService,
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
      this.coreLayoutService.currentGuiObject$.pipe(
        first(),
        filter(Boolean),
        map(item => item.docs),
      )
      .subscribe(docs => this.helpService.open(docs));
    }
  }

  @HostListener('window:help', [ '$event' ])
  onHelp(event: KeyboardEvent): boolean {
    event.preventDefault();
    return false;
  }
}
