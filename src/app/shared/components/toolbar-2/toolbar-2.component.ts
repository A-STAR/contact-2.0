import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { IAppState } from '../../../core/state/state.interface';
import { IToolbarItem, IToolbarCheckbox, ToolbarItemTypeEnum } from './toolbar-2.interface';

@Component({
  selector: 'app-toolbar-2',
  templateUrl: './toolbar-2.component.html',
  styleUrls: [ './toolbar-2.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Toolbar2Component implements OnInit {
  @Input() items: Array<IToolbarItem> = [];

  private _items$: Observable<Array<any>>;

  constructor(
    private store: Store<IAppState>
  ) {}

  ngOnInit(): void {
    this._items$ = this.store.map(state =>
      this.items.map(item => ({
        ...item,
        disabled: this.isDisabled(item, state) || this.isForbidden(item, state),
        state: this.getState(item, state)
      }))
    );
  }

  get items$(): Observable<Array<any>> {
    return this._items$;
  }

  isButton(item: IToolbarItem): boolean {
    return item.type === ToolbarItemTypeEnum.BUTTON;
  }

  isCheckbox(item: IToolbarItem): boolean {
    return item.type === ToolbarItemTypeEnum.CHECKBOX;
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

  private isForbidden(item: IToolbarItem, state: IAppState): boolean {
    // TODO: use permissionsService methods instead
    return item.permissions ? item.permissions.reduce((acc, name) => acc && !state.permissions.permissions[name], true) : false;
  }

  private getState(item: IToolbarItem, state: IAppState): boolean {
    return this.isCheckbox(item) ? (item as IToolbarCheckbox).state(state) : undefined;
  }
}
