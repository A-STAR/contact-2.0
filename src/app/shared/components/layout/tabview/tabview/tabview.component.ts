import {
  AfterContentInit,
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
import { Subscription } from 'rxjs/Subscription';

import { ILayoutDimension } from '@app/layout/layout.interface';
import { LayoutService } from '@app/layout/layout.service';

import { TabViewTabComponent } from '../tab/tab.component';

@Component({
  selector: 'app-tabview',
  templateUrl: 'tabview.component.html',
  styleUrls: ['./tabview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class TabViewComponent implements OnInit, AfterContentInit, OnDestroy, AfterViewInit {

  @ViewChildren('tabHeader') tabHeaders: QueryList<ElementRef>;

  @ContentChildren(TabViewTabComponent) tabs: QueryList<TabViewTabComponent>;

  @Input() noMargin = false;

  @Output() select = new EventEmitter<number>();

  private tabHeaderDimensions: Partial<ILayoutDimension>[] = [];

  private layoutSubscription: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private el: ElementRef,
    private renderer: Renderer2,
    private layoutService: LayoutService
  ) { }

  ngOnInit(): void {
    this.layoutSubscription = this.layoutService.contentDimension$
      .filter(Boolean)
      .subscribe(() => this.cdRef.markForCheck());
  }

  ngAfterContentInit(): void {
    const activeTabs = this.tabs.filter(tab => tab.active);

    // if no active tab is set, activate the first
    if (!activeTabs.length) {
      this.selectTab(null, this.tabs.filter(tab => !tab.disabled)[0]);
    }
  }

  ngAfterViewInit(): void {
    this.tabHeaderDimensions = this.tabHeaders.map(tabHeader => ({
      left: tabHeader.nativeElement.offsetLeft,
      width: tabHeader.nativeElement.clientWidth,
    }));
    this.cdRef.markForCheck();
  }

  ngOnDestroy(): void {
    this.layoutSubscription.unsubscribe();
  }

  get visibleTabs(): TabViewTabComponent[] {
    return this.tabs.filter((tab, index) => this.isHeaderTabVisible(index));
  }

  get hiddenTabs(): TabViewTabComponent[] {
    return this.tabs.filter((tab, index) => !this.isHeaderTabVisible(index));
  }

  isHeaderTabVisible(tabIndex: number): boolean {
    const tabHeader = this.tabHeaderDimensions[tabIndex];
    return !tabHeader || (tabHeader.left + tabHeader.width) < this.tabHeaderWidth;
  }

  selectTab(event: MouseEvent, tab: TabViewTabComponent): void {
    if (tab.disabled) {
      return;
    }

    const tabIndex = this.getTabIndex(tab);
    const activeIndex = this.tabs.toArray().findIndex(el => el.active);

    // deactivate all tabs
    this.tabs.toArray().forEach(el => el.active = false);

    // activate the tab the user has clicked on only if the selection is different
    tab.active = true;
    if (activeIndex !== tabIndex) {
      this.select.emit(tabIndex);
    }

    if (!event) {
      return;
    }

    // jQuery
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

  private get tabHeaderWidth(): any {
    return this.el.nativeElement.querySelector('ul').clientWidth - 50;
  }

  private getTabIndex(tab: TabViewTabComponent): number {
    return this.tabs.toArray().findIndex(el => el === tab);
  }
}
