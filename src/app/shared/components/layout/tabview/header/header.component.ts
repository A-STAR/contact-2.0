import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { filter } from 'rxjs/operators/filter';
import { of } from 'rxjs/observable/of';
import { Subscription } from 'rxjs/Subscription';

import { ITab } from './header.interface';

import { TabHeaderService } from './header.service';
import { RoutingService } from '@app/core/routing/routing.service';

@Component({
  selector: 'app-tabview-header',
  templateUrl: 'header.component.html',
  styleUrls: ['./header.component.scss'],
  // providers: [ TabHeaderService ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabHeaderComponent implements OnInit, OnDestroy {

  private tabPermsChangeSub: Subscription;
  private routeChangeSub: Subscription;

  @Input()
  set tabs(tabs: ITab[]) {
    if (tabs !== null) {
      const tabsWithPermissions = this.setTabPermissions(tabs);

      this.headerService.tabs$.next(tabsWithPermissions);

      if (this.tabPermsChangeSub) {
        this.tabPermsChangeSub.unsubscribe();
      }

      this.tabPermsChangeSub = this.onTabPermChange(tabsWithPermissions);
    }
  }

  @Input() noMargin = false;

  @Output() tabClose = new EventEmitter<number>();

  activatedLink: string;

  private currentUrl: string;
  private _initialized = false;
  private _clicked = false;

  tabIndex = 0;

  constructor(
    private headerService: TabHeaderService,
    private routingService: RoutingService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  closeTab(event: MouseEvent, id: number): void {
    event.stopPropagation();
    this.tabClose.emit(id);
  }

  ngOnInit(): void {
    this.currentUrl = this.router.url;
    this.routeChangeSub = this.router.events
      .pipe(
        filter(e => e instanceof NavigationEnd && this.currentUrl === e.urlAfterRedirects),
        filter(() => Boolean(this.activatedLink))
      )
      .subscribe(() => {
        if (!this._clicked) {
          this.navigate();
          this.activatedLink = null;
        }
        this._clicked = false;
      });
  }

  ngOnDestroy(): void {
    if (this.tabPermsChangeSub) {
      this.tabPermsChangeSub.unsubscribe();
    }
    this.routeChangeSub.unsubscribe();
  }

  onClick(tabIndex: number): void {
    this.tabIndex = tabIndex;
    this._clicked = true;
  }

  private setTabPermissions(tabs: ITab[]): ITab[] {

    const tabsWithPermissions: ITab[] = tabs.map((tab: ITab) => {

      if (!tab.hasPermission) {
        tab.hasPermission = of(true);
      }

      return tab;
    });

    return tabsWithPermissions;
  }

  private onTabPermChange(tabs: ITab[]): Subscription {
    return combineLatest(...tabs.map(tab => tab.hasPermission))
      .subscribe((tabPerms: boolean[]) => {
        const tabIndex = tabPerms.findIndex(Boolean);
        if (tabIndex !== -1 && !tabPerms[this.tabIndex]) {

          this.activatedLink = tabs[tabIndex].link;
          this.tabIndex = tabIndex;
          this._clicked = false;

          if (!this._initialized) {
            this.navigate();
            this._initialized = true;
          }

        }
      });
  }


  private navigate(): void {
    this.routingService
      .navigate([this.activatedLink], this.route);
  }
}
