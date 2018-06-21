import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { of } from 'rxjs/observable/of';

import { ITab } from './header.interface';

@Component({
  selector: 'app-tabview-header',
  templateUrl: 'header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabHeaderComponent {

  tabs$ = new BehaviorSubject<ITab[]>([]);

  @Input()
  set tabs(tabs: ITab[]) {
    if (tabs !== null) {
      const tabsWithPermissions = this.setTabPermissions(tabs);

      this.tabs$.next(tabsWithPermissions);
    }
  }

  @Input() noMargin = false;

  @Output() tabClose = new EventEmitter<number>();

  closeTab(event: MouseEvent, id: number): void {
    event.stopPropagation();
    this.tabClose.emit(id);
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

}
