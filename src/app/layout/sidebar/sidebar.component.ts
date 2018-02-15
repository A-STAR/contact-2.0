import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { filter, map, startWith } from 'rxjs/operators';

import { GuiObjectsService } from '@app/core/gui-objects/gui-objects.service';
import { SettingsService } from '@app/core/settings/settings.service';
import { LayoutService } from '@app/layout/layout.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: [ './sidebar.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent implements OnInit {

  menuItems$: Observable<any>;
  showTitle = false;

  constructor(
    private cdRef: ChangeDetectorRef,
    private menuService: GuiObjectsService,
    private router: Router,
    private settingsService: SettingsService,
    private layoutService: LayoutService
  ) {}

  ngOnInit(): void {
    this.showTitle = !this.isCollapsed;

    this.menuItems$ = combineLatest(
      this.menuService.menuItems,
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd),
        startWith(null),
      ),
      items => items
    )
    .pipe(
      map(items => {
        const url = '/' + this.router.url.split('/').filter(Boolean)[0];
        const item = items.find(i => i.link === url);
        return item && item.children || [ item ];
      }),
      map(items => items.filter(item => item && item.text)),
    );
  }

  get isCollapsed(): boolean {
    return this.settingsService.getLayoutSetting('isCollapsed') as boolean;
  }

  onSidebarToggle(): void {
    this.settingsService.toggleLayoutSetting('isCollapsed');
    if (this.isCollapsed) {
      this.showTitle = false;
    }
    this.cdRef.markForCheck();
  }

  onTransitionEnd(e: TransitionEvent): void {
    this.layoutService.triggerContentDimensionChange();
    if (!(<HTMLElement>e.target).classList.contains('collapsed')) {
      this.showTitle = true;
    }
  }
}
