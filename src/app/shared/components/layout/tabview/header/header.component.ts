import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { of } from 'rxjs/observable/of';

import { ITab } from './header.interface';

@Component({
  selector: 'app-tabview-header',
  templateUrl: 'header.component.html',
  styleUrls: [ './header.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabHeaderComponent implements OnInit {
  @Input() noMargin = false;
  @Input() tabs: ITab[] = [];

  ngOnInit(): void {
    // if no hasPermission prop was passed, count tab as permitted
    this.tabs.map(tab => ({...tab, hasPermission: tab.hasPermission || of(true)}));
  }
}
