import { ChangeDetectionStrategy, Component, OnChanges, SimpleChanges, Input, Output, EventEmitter } from '@angular/core';
// import { ChangeDetectionStrategy, Component, OnChanges, Input, Output, EventEmitter } from '@angular/core';
// import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { of } from 'rxjs/observable/of';

import { ITab } from './header.interface';

@Component({
  selector: 'app-tabview-header',
  templateUrl: 'header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabHeaderComponent implements OnChanges {

  @Input() tabs: ITab[];
  @Input() noMargin = false;

  @Output() tabClose = new EventEmitter<number>();

  // tabs$ = new BehaviorSubject<ITab[]>([]);

  // ngOnChanges(): void { }
  ngOnChanges(changes: SimpleChanges): void {
    // console.log('Changes', changes.tabs);
    if (changes.tabs) {
      // console.log('Changes Tabs', changes.tabs);

      const tabs: ITab[] = this.tabs.map((tab: ITab) => {

        if (!tab.hasPermission) {
          tab.hasPermission = of(true);
        }

        return tab;
      });

      // this.tabs$.next(tabs);
      this.tabs = tabs;
    }
  }

  closeTab(event: MouseEvent, id: number): void {
    event.stopPropagation();
    this.tabClose.emit(id);
  }

}
