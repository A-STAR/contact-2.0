import { ChangeDetectorRef, ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';

import { IAppState } from '../../../core/state/state.interface';
import { IMenuItem } from '../../../core/gui-objects/gui-objects.interface';

import { GuiObjectsService } from '../../../core/gui-objects/gui-objects.service';

@Component({
  selector: 'app-header-menu',
  templateUrl: './header-menu.component.html',
  styleUrls: ['./header-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderMenuComponent implements OnInit, OnDestroy {
  menuItemsSub: Subscription;
  selectedMenuItemSub: Subscription;
  menuItems: IMenuItem[];

  constructor(
    private store: Store<IAppState>,
    private cdRef: ChangeDetectorRef,
    private guiObjectsService: GuiObjectsService
  ) { }

  ngOnInit(): void {
    this.menuItemsSub = this.guiObjectsService
      .menuItems
      .subscribe(items => {
        this.menuItems = items;
        this.cdRef.markForCheck();
      });
    this.selectedMenuItemSub = this.guiObjectsService.selectedMenuItem
      .subscribe(selectedItem => {
        this.markAsActive(selectedItem);
        this.cdRef.markForCheck();
      });
  }

  ngOnDestroy(): void {
    if (this.menuItemsSub) {
      this.menuItemsSub.unsubscribe();
    }
    if (this.selectedMenuItemSub) {
      this.selectedMenuItemSub.unsubscribe();
    }
  }

  onMainItemClick(item: IMenuItem): void {
    this.store.dispatch({
      type: GuiObjectsService.GUI_OBJECTS_SELECTED,
      payload: item
    });
  }

  private markAsActive(menuItem: IMenuItem): void {
    if (this.menuItems) {
      this.menuItems.forEach(item => {
        item.isActive = item.text === menuItem.text;
      });
    }
  }

}
