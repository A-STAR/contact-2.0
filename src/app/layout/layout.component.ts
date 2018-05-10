import { Component, HostListener } from '@angular/core';

import { HelpService } from '@app/core/help/help.service';
import { LayoutService } from './layout.service';

import { menuConfig } from '@app/routes/menu-config';

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
      const menuLinkUrl = this.layoutService.url
        .split('/')
        .slice(0, 4)
        .join('/');

      const itemKey = Object.keys(menuConfig).find(k => menuConfig[k].link === menuLinkUrl);
      if (itemKey) {
        this.helpService.open(menuConfig[itemKey].docs);
      } else if (menuLinkUrl.startsWith('/app/workplaces/debtor')) {
        this.helpService.open('debt_card');
      }
      event.preventDefault();
    }
  }

  @HostListener('window:help', [ '$event' ])
  onHelp(event: KeyboardEvent): boolean {
    event.preventDefault();
    return false;
  }
}
