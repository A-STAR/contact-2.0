import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { filter, map, startWith } from 'rxjs/operators';

import { IMenuItem } from '../../core/gui-objects/gui-objects.interface';

import { GuiObjectsService } from '../../core/gui-objects/gui-objects.service';
import { SettingsService } from '../../core/settings/settings.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: [ './sidebar.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent {
  private _menuItems$ = combineLatest(
    this.menuService.menuItems,
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      startWith(null),
    ),
    items => items
  ).pipe(
    map(items => {
      const url = '/' + this.router.url.split('/').filter(Boolean)[0];
      const item = items.find(i => i.link === url);
      return item && item.children || [ item ];
    })
  );

  constructor(
    private menuService: GuiObjectsService,
    private router: Router,
    public settings: SettingsService,
  ) {}

  get menuItems$(): Observable<IMenuItem[]> {
    return this._menuItems$;
  }

  // Close menu collapsing height
  closeMenu(elem: any): void {
      elem.height(elem[0].scrollHeight);
      // and move to zero to collapse
      elem.height(0);
      elem.removeClass('opening');
  }

  listenForExternalClicks(): void {
    const $doc = $(document).on('click.sidebar', (e) => {
      if (!$(e.target).parents('.aside').length) {
        this.removeFloatingNav();
        $doc.off('click.sidebar');
      }
    });
  }

  removeFloatingNav(): void {
    $('.nav-floating').remove();
  }

  isSidebarCollapsedText(): boolean {
    return this.settings.layout.isCollapsedText;
  }

  isEnabledHover(): boolean {
    return this.settings.layout.asideHover;
  }
}
