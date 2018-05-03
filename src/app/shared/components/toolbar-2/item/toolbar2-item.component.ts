import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { of } from 'rxjs/observable/of';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { IAppState } from '@app/core/state/state.interface';
import { IButtonType } from '@app/shared/components/button/button.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '@app/shared/components/toolbar-2/toolbar-2.interface';

import { DropdownDirective } from '@app/shared/components/dropdown/dropdown.directive';

import { doOnceIf, invert } from '@app/core/utils';

@Component({
  selector: 'app-toolbar-2-item',
  templateUrl: './toolbar2-item.component.html',
  styleUrls: ['./toolbar2-item.component.scss'],
})
export class Toolbar2ItemComponent {
  @Input() item: IToolbarItem;

  @Output() action = new EventEmitter<IToolbarItem>();

  @ViewChild(DropdownDirective) dropdown: DropdownDirective;

  defaultItems: { [ToolbarItemTypeEnum: number]: IButtonType } = {
    [ToolbarItemTypeEnum.BUTTON_ADD]: 'add',
    [ToolbarItemTypeEnum.BUTTON_ADD_USER]: 'addUser',
    [ToolbarItemTypeEnum.BUTTON_BLOCK]: 'block',
    [ToolbarItemTypeEnum.BUTTON_CALL]: 'call',
    [ToolbarItemTypeEnum.BUTTON_CHANGE_STATUS]: 'changeStatus',
    [ToolbarItemTypeEnum.BUTTON_CLOSE]: 'close',
    [ToolbarItemTypeEnum.BUTTON_CLEAR]: 'clear',
    [ToolbarItemTypeEnum.BUTTON_COPY]: 'copy',
    [ToolbarItemTypeEnum.BUTTON_DELETE]: 'delete',
    [ToolbarItemTypeEnum.BUTTON_DROP]: 'drop',
    [ToolbarItemTypeEnum.BUTTON_DOWNLOAD]: 'download',
    [ToolbarItemTypeEnum.BUTTON_EDIT]: 'edit',
    [ToolbarItemTypeEnum.BUTTON_EMAIL]: 'email',
    [ToolbarItemTypeEnum.BUTTON_EXCEL_LOAD]: 'loadFromExcel',
    [ToolbarItemTypeEnum.BUTTON_INFO]: 'info',
    [ToolbarItemTypeEnum.BUTTON_MAP]: 'map',
    [ToolbarItemTypeEnum.BUTTON_MOVE]: 'move',
    [ToolbarItemTypeEnum.BUTTON_NEXT]: 'next',
    [ToolbarItemTypeEnum.BUTTON_OK]: 'ok',
    [ToolbarItemTypeEnum.BUTTON_PAUSE]: 'pause',
    [ToolbarItemTypeEnum.BUTTON_RESUME]: 'resume',
    [ToolbarItemTypeEnum.BUTTON_REFRESH]: 'refresh',
    [ToolbarItemTypeEnum.BUTTON_REGISTER_CONTACT]: 'registerContact',
    [ToolbarItemTypeEnum.BUTTON_SAVE]: 'save',
    [ToolbarItemTypeEnum.BUTTON_SMS]: 'sms',
    [ToolbarItemTypeEnum.BUTTON_START]: 'start',
    [ToolbarItemTypeEnum.BUTTON_STOP]: 'stop',
    [ToolbarItemTypeEnum.BUTTON_TRANSFER]: 'transfer',
    [ToolbarItemTypeEnum.BUTTON_UNBLOCK]: 'unblock',
    [ToolbarItemTypeEnum.BUTTON_UNDO]: 'undo',
    [ToolbarItemTypeEnum.BUTTON_UPLOAD]: 'upload',
    [ToolbarItemTypeEnum.BUTTON_VERSION]: 'version',
    [ToolbarItemTypeEnum.BUTTON_VISIT]: 'visit',
  };

  constructor(private store: Store<IAppState>) {}

  onClick(item: IToolbarItem): void {
    doOnceIf(this.isDisabled(item).map(invert), () => {
      if (typeof item.action === 'function') {
        item.action();
      } else if (item.action) {
        this.store.dispatch(item.action);
      }
      this.action.emit(item);
    });
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
      item.type === ToolbarItemTypeEnum.BUTTON ||
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
    return item.type === ToolbarItemTypeEnum.CHECKBOX;
  }

  getItemCls(item: IToolbarItem): object {
    return {
      'align-right': item.align === 'right',
    };
  }
}
