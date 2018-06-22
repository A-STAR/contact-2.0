import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { of } from 'rxjs/observable/of';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { filter, map, startWith } from 'rxjs/operators';

import { IMenuItem } from '@app/core/gui-objects/gui-objects.interface';

import { GuiObjectsService } from '@app/core/gui-objects/gui-objects.service';
import { SettingsService } from '@app/core/settings/settings.service';
import { LayoutService } from '@app/layout/layout.service';
import { LayoutService as CoreLayoutService } from '@app/core/layout/layout.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-sidebar',
  styleUrls: [ './sidebar.component.scss' ],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnInit {
  private lastDebtCardIds$ = this.coreLayoutService.lastDebtCardIds$;

  readonly menuItems$ = combineLatest(
    this.menuService.menuItems,
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      startWith(null),
    ),
    this.lastDebtCardIds$,
    (items: IMenuItem[]) => items
  )
  .pipe(
    map((items: IMenuItem[]) => {
      const url = '/app/' + this.router.url.split('/').filter(Boolean)[1];
      const item = items.find(i => i.link === url);

      if (url === '/app/workplaces') {
        this.getLastDebtCard(item);
      }

      return item && item.children || [ item ];
    }),
    map((items: IMenuItem[]) => items.filter(item => item && item.text)),
  );

  showTitle = false;

  constructor(
    private cdRef: ChangeDetectorRef,
    private menuService: GuiObjectsService,
    private router: Router,
    private settingsService: SettingsService,
    private layoutService: LayoutService,
    private coreLayoutService: CoreLayoutService,
  ) {}

  ngOnInit(): void {
    this.showTitle = !this.isCollapsed;
  }

  get isCollapsed(): boolean {
    return this.settingsService.getLayoutSetting('isCollapsed') as boolean;
  }

  onSidebarToggle(): void {
    this.settingsService.toggleLayoutSetting('isCollapsed');
    this.showTitle = !this.showTitle;
    this.cdRef.markForCheck();
  }

  onTransitionEnd(e: TransitionEvent): void {
    this.layoutService.triggerContentDimensionChange();
    if (!(<HTMLElement>e.target).classList.contains('collapsed')) {
      this.showTitle = true;
    }
  }

  private getLastDebtCard(item: IMenuItem): void {
    const lastDebtorCardIds = this.lastDebtCardIds$.value;

    if (Boolean(lastDebtorCardIds)) {
      const path = '/app/workplaces/debtor/';
      const { debtorId, debtId } = lastDebtorCardIds;
      const lastDebtorCardLink = `${path}${debtorId}/debt/${debtId}`;

      const lastDebtorCardIndex = item.children.findIndex(e => e.link.includes(path) );

      if (lastDebtorCardIndex === -1) {
        const lastDebtCard: IMenuItem = {
          text: 'sidebar.nav.menu.DEBTOR_CARD',
          link: lastDebtorCardLink,
          icon: null,
          docs: 'debt_card',
          children: null,
          permission: of(true),
        };

        (item.children as IMenuItem[]) = [...item.children, lastDebtCard];
      } else {
        item.children[lastDebtorCardIndex].link = lastDebtorCardLink;
      }

    }
  }

}
