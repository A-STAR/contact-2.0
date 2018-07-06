import { Component, Input, Output, EventEmitter, ViewChild, OnDestroy, OnInit } from '@angular/core';
import { of } from 'rxjs/observable/of';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

import { IAppState } from '@app/core/state/state.interface';
import { IToolbarItem, ToolbarItemType } from '@app/shared/components/toolbar-2/toolbar-2.interface';
import { ButtonType } from '@app/shared/components/button/button.interface';

import { DropdownDirective } from '@app/shared/components/dropdown/dropdown.directive';

import { doOnceIf, invert } from '@app/core/utils';
import { IconType } from '@app/shared/components/icons/icons.interface';

@Component({
  selector: 'app-toolbar-2-item',
  templateUrl: './toolbar2-item.component.html',
  styleUrls: ['./toolbar2-item.component.scss'],
})
export class Toolbar2ItemComponent implements OnInit, OnDestroy {
  static ITEM_DEBOUNCE_TIME = 500;

  @Input() item: IToolbarItem;

  @Output() action = new EventEmitter<IToolbarItem>();

  @ViewChild(DropdownDirective) dropdown: DropdownDirective;

  defaultItems: { [ToolbarItemType: number]: IconType } = {
    [ToolbarItemType.BUTTON_ADD]: 'add',
    [ToolbarItemType.BUTTON_ADD_USER]: 'addUser',
    [ToolbarItemType.BUTTON_ADD_PROPERTY]: 'addProperty',
    [ToolbarItemType.BUTTON_BLOCK]: 'block',
    [ToolbarItemType.BUTTON_CALL]: 'call',
    [ToolbarItemType.BUTTON_CHANGE_STATUS]: 'changeStatus',
    [ToolbarItemType.BUTTON_CLOSE]: 'close',
    [ToolbarItemType.BUTTON_CLEAR]: 'clear',
    [ToolbarItemType.BUTTON_COPY]: 'copy',
    [ToolbarItemType.BUTTON_DELETE]: 'delete',
    [ToolbarItemType.BUTTON_DROP]: 'drop',
    [ToolbarItemType.BUTTON_DOWNLOAD]: 'download',
    [ToolbarItemType.BUTTON_EDIT]: 'edit',
    [ToolbarItemType.BUTTON_EMAIL]: 'email',
    [ToolbarItemType.BUTTON_EXCEL_LOAD]: 'loadFromExcel',
    [ToolbarItemType.BUTTON_INFO]: 'info',
    [ToolbarItemType.BUTTON_MAP]: 'map',
    [ToolbarItemType.BUTTON_MOVE]: 'move',
    [ToolbarItemType.BUTTON_NEXT]: 'next',
    [ToolbarItemType.BUTTON_OK]: 'ok',
    [ToolbarItemType.BUTTON_PAUSE]: 'pause',
    [ToolbarItemType.BUTTON_RESUME]: 'resume',
    [ToolbarItemType.BUTTON_REFRESH]: 'refresh',
    [ToolbarItemType.BUTTON_REGISTER_CONTACT]: 'registerContact',
    [ToolbarItemType.BUTTON_SAVE]: 'save',
    [ToolbarItemType.BUTTON_SMS]: 'sms',
    [ToolbarItemType.BUTTON_START]: 'start',
    [ToolbarItemType.BUTTON_STOP]: 'stop',
    [ToolbarItemType.BUTTON_TRANSFER]: 'transfer',
    [ToolbarItemType.BUTTON_UNBLOCK]: 'unblock',
    [ToolbarItemType.BUTTON_UNDO]: 'undo',
    [ToolbarItemType.BUTTON_UPLOAD]: 'upload',
    [ToolbarItemType.BUTTON_VERSION]: 'version',
    [ToolbarItemType.BUTTON_VISIT]: 'visit',
  };

  private click$ = new Subject<IToolbarItem>();
  private clickSub: Subscription;

  constructor(private store: Store<IAppState>) {}

  ngOnInit(): void {
    this.clickSub = this.click$
      .debounceTime(Toolbar2ItemComponent.ITEM_DEBOUNCE_TIME)
      .subscribe(item => doOnceIf(this.isDisabled(item).map(invert), () => {
        if (typeof item.action === 'function') {
          item.action();
        } else if (item.action) {
          this.store.dispatch(item.action);
        }
        this.action.emit(item);
      }));
  }

  ngOnDestroy(): void {
    this.clickSub.unsubscribe();
  }

  onClick(item: IToolbarItem): void {
    this.click$.next(item);
  }

  onDropdownItemClick(item: IToolbarItem): void {
    this.dropdown.close();
    this.onClick(item);
  }

  isDisabled(item: IToolbarItem): Observable<boolean> {
    return item.enabled ? item.enabled.map(enabled => !enabled) : of(false);
  }

  getButtonType(item: IToolbarItem): IButtonType {
    return this.defaultItems[item.type];
  }

  isButton(item: IToolbarItem): boolean {
    return (
      item.type === ToolbarItemType.BUTTON ||
      Object.keys(this.defaultItems).includes(String(item.type))
    );
  }

  getItemType(item: IToolbarItem): string {
    switch (true) {
      case Boolean(this.isButton(item)):
        return 'button';
      case Boolean(this.isCheckbox(item)):
        return 'checkbox';
      default:
        throw new Error(`Uknown item type ${item.type} for toolbar2!`);
    }
  }

  isCheckbox(item: IToolbarItem): boolean {
    return item.type === ToolbarItemType.CHECKBOX;
  }

  getItemCls(item: IToolbarItem): object {
    return {
      'align-right': item.align === 'right',
    };
  }
}
