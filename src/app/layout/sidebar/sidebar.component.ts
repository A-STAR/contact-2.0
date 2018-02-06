import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { filter, map, startWith } from 'rxjs/operators';

import { IMenuItem } from '@app/core/gui-objects/gui-objects.interface';

import { GuiObjectsService } from '@app/core/gui-objects/gui-objects.service';
import { SettingsService } from '@app/core/settings/settings.service';

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
    }),
    map(items => items.filter(item => item && item.text)),
  );

  constructor(
    private cdRef: ChangeDetectorRef,
    private menuService: GuiObjectsService,
    private router: Router,
    private settingsService: SettingsService,
  ) {}

  get menuItems$(): Observable<IMenuItem[]> {
    return this._menuItems$;
  }

  get isCollapsed(): boolean {
    return this.settingsService.getLayoutSetting('isCollapsed') as boolean;
  }

  onSidebarToggle(): void {
    this.settingsService.toggleLayoutSetting('isCollapsed');
    this.cdRef.markForCheck();
  }
}
