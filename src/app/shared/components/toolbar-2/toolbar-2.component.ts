import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { IAppState } from '../../../core/state/state.interface';
import { IToolbarItem, IToolbarCheckbox, ToolbarToolbarItemTypeEnum } from './toolbar-2.interface';

import { PermissionsService } from '../../../core/permissions/permissions.service';

@Component({
  selector: 'app-toolbar-2',
  templateUrl: './toolbar-2.component.html',
  styleUrls: [ './toolbar-2.component.scss' ]
})
export class Toolbar2Component implements OnInit {
  @Input() items: Array<IToolbarItem> = [];

  private _items$: Observable<Array<any>>;

  constructor(
    private permissionsService: PermissionsService,
    private store: Store<IAppState>
  ) {}

  ngOnInit(): void {
    this._items$ = this.store.map(state =>
      this.items.map(item => ({
        ...item,
        // TODO: maybe use hasPermission2 with zip?
        disabled: this.isDisabled(item, state) || this.isForbidden(item),
        state: this.getState(item, state)
      }))
    );
  }

  get items$(): Observable<Array<any>> {
    return this._items$;
  }

  isButton(item: IToolbarItem): boolean {
    return item.type === ToolbarToolbarItemTypeEnum.BUTTON;
  }

  isCheckbox(item: IToolbarItem): boolean {
    return item.type === ToolbarToolbarItemTypeEnum.CHECKBOX;
  }

  onClick(item: IToolbarItem): void {
    if (typeof item.action === 'function') {
      item.action();
    } else {
      this.store.dispatch(item.action);
    }
  }

  private isDisabled(item: IToolbarItem, state: IAppState): boolean {
    return item.disabled ? item.disabled(state) : false;
  }

  private isForbidden(item: IToolbarItem): boolean {
    return item.permissions ? !this.permissionsService.hasOnePermission(item.permissions) : false;
  }

  private getState(item: IToolbarItem, state: IAppState): boolean {
    return this.isCheckbox(item) ? (item as IToolbarCheckbox).state(state) : undefined;
  }
}
