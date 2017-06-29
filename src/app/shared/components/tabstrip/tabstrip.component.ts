import {
  Component,
  ContentChildren,
  QueryList,
  AfterContentInit,
  ElementRef,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChild,
  DoCheck,
} from '@angular/core';

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
  isToolsVisible: boolean;

  constructor(
    private elementRef: ElementRef,
    private detectorRef: ChangeDetectorRef) {
  }

  ngDoCheck(): void {
    this.ps.ngDoCheck(); // TODO Make github issue request
    this.refreshTools();
  }

  ngAfterContentInit(): void {
    const activeTabs = this.tabs.filter(tab => tab.active);

    // if there is no active tab set, activate the first
    if (!activeTabs.length) {
      this.selectTab(this.tabs.first);
    }
  }

  ngAfterViewInit(): void {
    this.refreshTools();
  }

  selectTab(tab: TabComponent): void {
    // deactivate all tabs
    this.tabs.toArray().forEach(el => el.active = false);
    // activate the tab the user has clicked on
    tab.active = true;
  }

  closeTab(tab: TabComponent): void {
    const index = this.tabs.toArray().findIndex(el => el === tab);
    tab.onClose.emit(index);
  }

  refreshTools(): void {
    const xRail = this.elementRef.nativeElement.querySelector('.ps__scrollbar-x-rail');
    const yRail = this.elementRef.nativeElement.querySelector('.ps__scrollbar-y-rail');
    if (xRail && yRail) {
      // jQuery
      this.isToolsVisible = $(xRail).is(':visible') || $(yRail).is(':visible');
      this.detectorRef.detectChanges();
    }
  }

  onRight(): void {
    this.ps.scrollToRight();
  }

  onLeft(): void {
    this.ps.scrollToLeft();
  }
}
