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
  DoCheck,
} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { delay } from 'rxjs/operators';

import { LayoutService } from '@app/layout/layout.service';

import { TabViewTabComponent } from '../tab/tab.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-size' },
  selector: 'app-tabview',
  styleUrls: ['./tabview.component.scss'],
  templateUrl: 'tabview.component.html',
})

export class TabViewComponent implements OnInit, OnDestroy, AfterViewInit, DoCheck {
  private static MENU_BTN_SPACE = 50;

  private originalOrderedTabs: TabViewTabComponent[];

  private tabHeaders$ = new BehaviorSubject< QueryList<ElementRef>>(null);
  @ViewChildren('tabHeader') set tabHeader(value: QueryList<ElementRef>) {
    this.tabHeaders$.next(value);
    this.setTabsOrder();
  }

  private tabs$ = new BehaviorSubject<TabViewTabComponent[]>(null);
  @ContentChildren(TabViewTabComponent) set tabComponents(value: QueryList<TabViewTabComponent>) {
    this.originalOrderedTabs = [ ...value.toArray() ];
    this.tabs$.next(value.toArray());
  }

  @Input() fullHeight = false;
  @Input() noMargin = false;

  @Output() selectTab = new EventEmitter<number>();

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
    this.tabsSubscriptions = combineLatest(
      this.tabs.map(tab => tab.visible$),
      this.tabHeaders$
    )
    .pipe(
      delay(0)
    )
    .subscribe(() => {
      this.setInitialTab();
      this.cdRef.markForCheck();
    });
  }

  ngDoCheck(): void {
    this.cdRef.markForCheck();
  }

  ngOnDestroy(): void {
    this.routerSubscription.unsubscribe();
    this.layoutSubscription.unsubscribe();
    this.tabsSubscriptions.unsubscribe();
  }

  get tabs(): TabViewTabComponent[] {
    return this.tabs$.value;
  }

  get tabHeaders(): QueryList<ElementRef> {
    return this.tabHeaders$.value;
  }

  get visibleTabs(): TabViewTabComponent[] {
    return this.tabs.filter(tab => tab.visible);
  }

  get menuTabs(): TabViewTabComponent[] {
    return this.tabs.filter(tab => tab.visible && !this.feetsInView(tab));
  }

  feetsInView(tab: TabViewTabComponent): boolean {
    const visibleTabs = this.visibleTabs;
    const tabIndex = visibleTabs.indexOf(tab);
    const activeIndex = visibleTabs.findIndex(el => el.active);

    if (activeIndex < 0) {
      return false;
    }

    const visibleHeaders = this.tabHeaders.toArray();
    const headerWidth = this.tabHeaderWidth - TabViewComponent.MENU_BTN_SPACE;

    const activeTabHeader = {
      left: visibleHeaders[activeIndex].nativeElement.offsetLeft,
      width: visibleHeaders[activeIndex].nativeElement.clientWidth
    };
    const tabHeader = {
      left: visibleHeaders[tabIndex].nativeElement.offsetLeft,
      width: visibleHeaders[tabIndex].nativeElement.clientWidth
    };

    const feetsInView = activeIndex > tabIndex
      ? tabHeader.left + tabHeader.width < headerWidth - activeTabHeader.width
      : tabHeader.left + tabHeader.width < headerWidth;

    return !this.tabHeaderWidth || activeIndex === tabIndex || feetsInView;
  }

  onSelectTab(event: MouseEvent, tab: TabViewTabComponent): void {
    if (tab.disabled) {
      return;
    }

    const tabIndex = this.originalOrderedTabs.findIndex(el => el === tab);
    const activeIndex = this.originalOrderedTabs.findIndex(el => el.active);

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

    this.showRipple(event, this.tabs.indexOf(tab));
  }

  private get tabHeaderWidth(): any {
    return this.el.nativeElement.querySelector('ul').clientWidth;
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

  private setInitialTab(): void {
    const tabs = this.tabs.filter(tab => !tab.disabled && tab.visible);
    const activeTabs = tabs.filter(tab => tab.active);

    // if no active tab is set, activate the first
    if (!activeTabs.length && tabs.length) {
      this.onSelectTab(null, tabs[0]);
    }
  }

  private setTabsOrder(): void {
    this.tabs$.next([
      ...this.originalOrderedTabs.filter(tab => tab.visible && this.feetsInView(tab)),
      ...this.originalOrderedTabs.filter(tab => tab.visible && !this.feetsInView(tab)),
      ...this.originalOrderedTabs.filter(tab => !tab.visible)
    ]);
  }
}
