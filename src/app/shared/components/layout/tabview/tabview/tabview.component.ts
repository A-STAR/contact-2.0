import {
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  Renderer2,
  QueryList,
  ViewChildren,
  ChangeDetectorRef,
  OnInit,
  OnDestroy,
  AfterViewInit,
} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { ILayoutDimension } from '@app/layout/layout.interface';
import { LayoutService } from '@app/layout/layout.service';

import { TabViewTabComponent } from '../tab/tab.component';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { distinctUntilChanged } from 'rxjs/operators';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-size' },
  selector: 'app-tabview',
  styleUrls: ['./tabview.component.scss'],
  templateUrl: 'tabview.component.html',
})

export class TabViewComponent implements OnInit, OnDestroy, AfterViewInit {
  private static MENU_BTN_SPACE = 50;

  @ViewChildren('tabHeader') tabHeaders: QueryList<ElementRef>;
  @ContentChildren(TabViewTabComponent) tabs: QueryList<TabViewTabComponent>;

  @Input() fullHeight = false;
  @Input() noMargin = false;

  @Output() selectTab = new EventEmitter<number>();

  private defaultTabHeaderDimensions: Partial<ILayoutDimension>[] = [];
  private tabHeaderDimensions: Partial<ILayoutDimension>[] = [];

  private layoutSubscription: Subscription;
  private routerSubscription: Subscription;
  private tabsSubscriptions: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private el: ElementRef,
    private renderer: Renderer2,
    private router: Router,
    private layoutService: LayoutService,
  ) { }

  ngOnInit(): void {
    this.layoutSubscription = this.layoutService.contentDimension$
      .filter(Boolean)
      .subscribe(() => this.cdRef.markForCheck());

    this.routerSubscription = this.router.events
      .filter(event => event instanceof NavigationEnd)
      .subscribe(() => this.cdRef.markForCheck());
  }

  ngAfterViewInit(): void {
    this.defaultTabHeaderDimensions = this.tabHeaders.map(header => ({
      left: header.nativeElement.offsetLeft,
      width: header.nativeElement.clientWidth
    }));

    this.tabsSubscriptions = combineLatest(this.tabs.map(tab => tab.visible$))
      .pipe(
        // filter(visibility => !visibility.includes(null)),
        distinctUntilChanged()
      )
      .subscribe(visibility => {
        this.setDimensions(visibility);
        this.setInitialTab();
        this.cdRef.markForCheck();
      });
  }

  ngOnDestroy(): void {
    this.routerSubscription.unsubscribe();
    this.layoutSubscription.unsubscribe();
    this.tabsSubscriptions.unsubscribe();
  }

  get visibleTabs(): TabViewTabComponent[] {
    return this.tabs
      .filter((_, index) => this.isHeaderTabVisible(index))
      .filter(tab => tab.visible !== false);
  }

  get hiddenTabs(): TabViewTabComponent[] {
    // const tabs = this.tabs
    //   .filter((_, index) => !this.isHeaderTabVisible(index));
    return this.tabs
      .filter((_, index) => !this.isHeaderTabVisible(index))
      .filter(tab => tab.visible !== false);
  }

  isHeaderTabVisible(tabIndex: number): boolean {
    const activeIndex = this.tabs.toArray().findIndex(el => el.active);
    const activeTabHeader = this.tabHeaderDimensions[activeIndex];
    const tabHeader = this.tabHeaderDimensions[tabIndex] || {};
    const feetsInView = activeIndex > tabIndex
      ? tabHeader.left + tabHeader.width < this.tabHeaderWidth - activeTabHeader.width
      : tabHeader.left + tabHeader.width < this.tabHeaderWidth;
    return !tabHeader.width || activeIndex === tabIndex || feetsInView;
  }

  onSelectTab(event: MouseEvent, tab: TabViewTabComponent): void {
    if (tab.disabled) {
      return;
    }

    const tabIndex = this.getTabIndex(tab);
    const activeIndex = this.tabs.toArray().findIndex(el => el.active);

    // deactivate all tabs
    this.tabs.forEach(el => el.active = false);

    // activate the tab the user has clicked on only if the selection is different
    tab.active = true;
    if (activeIndex !== tabIndex) {
      this.selectTab.emit(tabIndex);
    }

    if (!event || tabIndex >= this.visibleTabs.length) {
      return;
    }

    this.showRipple(event, tabIndex);
  }

  private get tabHeaderWidth(): any {
    return this.el.nativeElement.querySelector('ul').clientWidth - TabViewComponent.MENU_BTN_SPACE;
  }

  private showRipple(event: MouseEvent, tabIndex: number): void {
    $(this.el.nativeElement).find('.ripple').remove();
    const $listItem = $(this.el.nativeElement).find('ul').children().eq(tabIndex);
    const posX = $listItem.offset().left;
    const posY = $listItem.offset().top;
    let buttonWidth = $listItem.width();
    let buttonHeight = $listItem.height();

    const listItems = Array.from(this.el.nativeElement.querySelector('ul').children);
    const active = listItems[tabIndex];
    const ripple = this.renderer.createElement('span');
    this.renderer.addClass(ripple, 'ripple');
    this.renderer.appendChild(active, ripple);
    if (buttonWidth >= buttonHeight) {
      buttonHeight = buttonWidth;
    } else {
      buttonWidth = buttonHeight;
    }

    // Get the center of the element
    const x = event.pageX - posX - buttonWidth / 2;
    const y = event.pageY - posY - buttonHeight / 2;
    $(this.el.nativeElement)
      .find('.ripple')
      .css({
        width: buttonWidth,
        height: buttonHeight,
        top: y + 'px',
        left: x + 'px'
      })
      .addClass('rippleEffect');
  }

  private getTabIndex(tab: TabViewTabComponent): number {
    return this.tabs.toArray().findIndex(el => el === tab);
  }

  private setDimensions(visibility: boolean[]): void {
    let left = 0;
    this.tabHeaderDimensions = this.defaultTabHeaderDimensions.map((dim, i) => {
      const tabDimension = {
        left,
        width: visibility[i] ? dim.width : 0,
      };
      left += tabDimension.width;
      return tabDimension;
    });
  }

  private setInitialTab(): void {
    const activeTabs = this.tabs.filter(tab => tab.active);

    // if no active tab is set, activate the first
    if (!activeTabs.length && this.tabs.length) {
      this.onSelectTab(null, this.tabs.filter(tab => !tab.disabled)[0]);
    }
  }
}
