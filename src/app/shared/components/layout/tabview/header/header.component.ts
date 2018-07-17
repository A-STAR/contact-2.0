import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  OnInit,
  ViewChildren,
  QueryList,
  ElementRef,
  ChangeDetectorRef,
} from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { filter } from 'rxjs/operators/filter';
import { Subscription } from 'rxjs/Subscription';
import { of } from 'rxjs/observable/of';
import { map } from 'rxjs/operators';

import { ITab } from './header.interface';

import { LayoutService } from '@app/layout/layout.service';

import { TabHeaderService } from './header.service';
import { RoutingService } from '@app/core/routing/routing.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
  selector: 'app-tabview-header',
  templateUrl: 'header.component.html',
  styleUrls: ['./header.component.scss'],
  providers: [ TabHeaderService ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabHeaderComponent implements OnInit, OnDestroy {
  private static MENU_BTN_SPACE = 50;

  private tabHeaders: QueryList<ElementRef>;
  private tabPermsChangeSub: Subscription;
  private routeChangeSub: Subscription;

  @ViewChildren('tabHeader') set headers (tabHeaders: QueryList<ElementRef>) {
    this.tabHeaders = tabHeaders;
    this.cdRef.detectChanges();
  }

  @Input()
  set tabs(tabs: ITab[]) {
    if (tabs !== null) {
      const tabsWithPermissions = this.setTabPermissions(tabs);

      this.headerService.tabs = tabsWithPermissions;

      if (this.tabPermsChangeSub) {
        this.tabPermsChangeSub.unsubscribe();
      }

      this.tabPermsChangeSub = this.onTabPermChange(tabsWithPermissions);
    }
  }

  @Input() noMargin = false;

  @Output() tabClose = new EventEmitter<number>();

  activatedLink: string;
  tabIndex = 0;
  private currentUrl: string;
  private _initialized = false;
  private _clicked = false;
  private visibleTabs$ = new BehaviorSubject<ITab[]>([]);
  private visibleTabsSub: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private el: ElementRef,
    private layoutService: LayoutService,
    private headerService: TabHeaderService,
    private routingService: RoutingService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.layoutService.contentDimension$
      .filter(Boolean)
      .subscribe(() => this.cdRef.markForCheck());

    this.visibleTabsSub = this.headerService.tabPerms$
      .pipe(
        map(tabPermissions => tabPermissions.map((p, index) => p && this.headerService.tabs[index]).filter(Boolean))
      )
      .subscribe(tabs => {
        this.visibleTabs$.next(tabs);
        this.cdRef.markForCheck();
      });

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
    this.visibleTabsSub.unsubscribe();
    if (this.tabPermsChangeSub) {
      this.tabPermsChangeSub.unsubscribe();
    }
    this.routeChangeSub.unsubscribe();
  }

  onClick(tabIndex: number): void {
    this.tabIndex = tabIndex;
    this._clicked = true;
  }

  closeTab(event: MouseEvent, id: number): void {
    event.stopPropagation();
    this.tabClose.emit(id);
  }

  get visibleTabs(): ITab[] {
    return this.visibleTabs$.value;
  }

  get menuTabs(): ITab[] {
    return this.headerService.tabs.filter(tab => this.visibleTabs.includes(tab) && !this.feetsInView(tab));
  }

  feetsInView(tab: ITab): boolean {
    const visibleTabs = this.visibleTabs;
    const tabIndex = visibleTabs.indexOf(tab);
    const visibleHeaders = this.tabHeaders && this.tabHeaders.toArray();

    if (!visibleHeaders || visibleHeaders.length !== visibleTabs.length) {
      return false;
    }

    const headerWidth = this.tabHeaderWidth - TabHeaderComponent.MENU_BTN_SPACE;

    const tabHeader = {
      left: visibleHeaders[tabIndex].nativeElement.offsetLeft,
      width: visibleHeaders[tabIndex].nativeElement.clientWidth
    };

    return tabHeader.left + tabHeader.width < headerWidth;
  }

  private get tabHeaderWidth(): any {
    return this.el.nativeElement.querySelector('ul').clientWidth;
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
