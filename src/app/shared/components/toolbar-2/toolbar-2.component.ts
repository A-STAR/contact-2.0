import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { IAppState } from '../../../core/state/state.interface';
import { IToolbarItem, IToolbarCheckbox, ToolbarItemTypeEnum, IToolbarDefaultElement } from './toolbar-2.interface';

@Component({
  selector: 'app-toolbar-2',
  templateUrl: './toolbar-2.component.html',
  styleUrls: [ './toolbar-2.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Toolbar2Component implements OnInit {
  @Input() items: Array<IToolbarItem> = [];

  private _items$: Observable<Array<any>>;

  defaultItems: { [ToolbarItemTypeEnum: number]: IToolbarDefaultElement } = {
    [ToolbarItemTypeEnum.BUTTON_ADD]: {
      label: 'toolbar.action.add',
      icon: 'fa fa-plus',
    },
    [ToolbarItemTypeEnum.BUTTON_EDIT]: {
      label: 'toolbar.action.edit',
      icon: 'fa fa-pencil',
    },
    [ToolbarItemTypeEnum.BUTTON_DELETE]: {
      label: 'toolbar.action.remove',
      icon: 'fa fa-trash',
    },
    [ToolbarItemTypeEnum.BUTTON_REFRESH]: {
      label: 'toolbar.action.refresh',
      icon: 'fa fa-refresh',
    },
  };

  buttonTypes: Array<ToolbarItemTypeEnum> = [
    ToolbarItemTypeEnum.BUTTON,
    ToolbarItemTypeEnum.BUTTON_ADD,
    ToolbarItemTypeEnum.BUTTON_EDIT,
    ToolbarItemTypeEnum.BUTTON_DELETE,
    ToolbarItemTypeEnum.BUTTON_REFRESH,
  ];

  constructor(
    private store: Store<IAppState>,
  ) {}

  ngOnInit(): void {
    // TODO(a.tymchuk): refactor to consume only inputs since this will fire
    // on every store update and negatively affect performance
    this._items$ = this.store.map(state =>
      this.items.map(el => {
        const defaultItem = this.defaultItems[el.type];
        const item = defaultItem ? { ...defaultItem, ...el } : el;

        return {
          ...item,
          disabled: this.isDisabled(item, state) || this.isForbidden(item, state),
          state: this.getCheckboxState(item, state)
        };
      })
    );
  }

  get items$(): Observable<Array<any>> {
    return this._items$;
  }

  isButton(item: IToolbarItem): boolean {
    return this.buttonTypes.includes(item.type);
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
    // TODO(d.maltsev): use permissionsService methods instead (asynchronous?)
    return item.permissions ? item.permissions.reduce((acc, name) => acc && !state.permissions.permissions[name], true) : false;
  }

  private getCheckboxState(item: IToolbarItem, state: IAppState): boolean {
    return this.isCheckbox(item) ? (item as IToolbarCheckbox).state(state) : undefined;
  }
}
