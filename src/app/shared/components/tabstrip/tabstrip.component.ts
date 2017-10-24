import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  DoCheck,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  QueryList,
  ViewChild,
} from '@angular/core';

// https://github.com/zefoy/ngx-perfect-scrollbar
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';

import { TabComponent } from './tab.component';

@Component({
  selector: 'app-tabstrip',
  templateUrl: 'tabstrip.component.html',
  styleUrls: ['./tabstrip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class TabstripComponent implements AfterContentInit, AfterViewInit, DoCheck {
  @ContentChildren(TabComponent) tabs: QueryList<TabComponent>;
  @ViewChild(PerfectScrollbarComponent) ps: PerfectScrollbarComponent;

  @Input() inverse = false;
  @Input() disableScrollbar = false;
  @Input() scrollerEnabled = false;

  @Output() select = new EventEmitter<number>();

  isToolsVisible: boolean;

  constructor(
    private elementRef: ElementRef,
    private cdRef: ChangeDetectorRef) {
  }

  ngDoCheck(): void {
    if (this.scrollerEnabled) {
      if (this.ps) {
        this.ps.ngDoCheck();
      }
      this.refreshTools();
    }
  }

  ngAfterContentInit(): void {
    const activeTabs = this.tabs.filter(tab => tab.active);

    // if there is no active tab set, activate the first
    if (!activeTabs.length) {
      this.selectTab(this.tabs.filter(tab => !tab.disabled)[0]);
    }
  }

  ngAfterViewInit(): void {
    if (this.scrollerEnabled) {
      this.refreshTools();
    }
  }

  selectTab(tab: TabComponent): void {
    if (tab.disabled) {
      return;
    }
    // deactivate all tabs
    this.tabs.toArray().forEach(el => el.active = false);
    // activate the tab the user has clicked on
    tab.active = true;
    this.select.emit(this.getTabIndex(tab));
  }

  closeTab(tab: TabComponent): void {
    tab.onClose.emit(this.getTabIndex(tab));
  }

  refreshTools(): void {
    const xRail = this.elementRef.nativeElement.querySelector('.ps__scrollbar-x-rail');
    const yRail = this.elementRef.nativeElement.querySelector('.ps__scrollbar-y-rail');
    if (xRail && yRail) {
      // jQuery
      this.isToolsVisible = $(xRail).is(':visible') || $(yRail).is(':visible');
      this.cdRef.detectChanges();
    }
  }

  onRight(): void {
    this.ps.scrollToRight();
  }

  onLeft(): void {
    this.ps.scrollToLeft();
  }

  private getTabIndex(tab: TabComponent): number {
    return this.tabs.toArray().findIndex(el => el === tab);
  }
}
