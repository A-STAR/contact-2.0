import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';

import { IAppState } from '../../../core/state/state.interface';
import { IMenuItem } from '../../../core/gui-objects/gui-objects.interface';

import { GuiObjectsService } from '../../../core/gui-objects/gui-objects.service';

@Component({
  selector: 'app-header-menu',
  templateUrl: './header-menu.component.html',
  styleUrls: ['./header-menu.component.scss']
})
export class HeaderMenuComponent implements OnInit, OnDestroy {
  menuItemsSub: Subscription;
  menuItems: IMenuItem[];

  constructor(
    private store: Store<IAppState>,
    private guiObjectsService: GuiObjectsService
  ) { }

  ngOnInit(): void {
    this.menuItemsSub = this.guiObjectsService
      .menuItems
      .subscribe(items => {
        this.menuItems = items;
      });
  }

  ngOnDestroy(): void {
    if (this.menuItemsSub) {
      this.menuItemsSub.unsubscribe();
    }
  }

  onMainItemClick(item: IMenuItem): void {
    this.menuItems.forEach(menuItem => {
      menuItem.isActive = menuItem === item;
    });
    this.store.dispatch({
      type: GuiObjectsService.GUI_OBJECTS_SELECTED,
      payload: item
    });
  }

}
