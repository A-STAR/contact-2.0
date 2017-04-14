import { Component, ContentChildren, QueryList, AfterContentInit } from '@angular/core';

import { TabComponent } from './tab.component';

@Component({
  selector: 'app-tabstrip',
  templateUrl: 'tabstrip.component.html',
  styleUrls: ['./tabstrip.component.scss']
})

export class TabstripComponent implements AfterContentInit {
  @ContentChildren(TabComponent) tabs: QueryList<TabComponent>;

  constructor() { }

  ngAfterContentInit() {
    const activeTabs = this.tabs.filter(tab => tab.active);

    // if there is no active tab set, activate the first
    if (activeTabs.length === 0) {
      this.selectTab(this.tabs.first);
    }
    console.log(this.tabs);
  }

  selectTab(tab: TabComponent){
    // deactivate all tabs
    this.tabs.toArray().forEach(el => el.active = false);

    // activate the tab the user has clicked on.
    tab.active = true;
  }

  closeTab(tab: TabComponent) {
    const index = this.tabs.toArray().findIndex(el => el === tab);
    tab.onClose.emit(index);
    // console.log(index);
  }
}
