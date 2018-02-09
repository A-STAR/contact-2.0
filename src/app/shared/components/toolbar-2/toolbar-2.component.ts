import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { of } from 'rxjs/observable/of';
import { Observable } from 'rxjs/Observable';

import { IAppState } from '../../../core/state/state.interface';
import { IButtonType } from '../button/button.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from './toolbar-2.interface';

import { DropdownComponent } from '@app/shared/components/dropdown/dropdown.component';

import { invert } from '../../../core/utils';
import { doOnceIf } from '../../../core/utils/helpers';

@Component({
  selector: 'app-toolbar-2',
  templateUrl: './toolbar-2.component.html',
  styleUrls: [ './toolbar-2.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Toolbar2Component {
  @Input() items: IToolbarItem[] = [];
  @Output() action = new EventEmitter<IToolbarItem>();
  @ViewChild('dropdown') dropdown: DropdownComponent;

  defaultItems: { [ToolbarItemTypeEnum: number]: IButtonType } = {
    [ToolbarItemTypeEnum.BUTTON_ADD]: 'add',
    [ToolbarItemTypeEnum.BUTTON_ADD_USER]: 'addUser',
    [ToolbarItemTypeEnum.BUTTON_BLOCK]: 'block',
    [ToolbarItemTypeEnum.BUTTON_CALL]: 'call',
    [ToolbarItemTypeEnum.BUTTON_CHANGE_STATUS]: 'changeStatus',
    [ToolbarItemTypeEnum.BUTTON_CLOSE]: 'close',
    [ToolbarItemTypeEnum.BUTTON_COPY]: 'copy',
    [ToolbarItemTypeEnum.BUTTON_DELETE]: 'delete',
    [ToolbarItemTypeEnum.BUTTON_DROP]: 'drop',
    [ToolbarItemTypeEnum.BUTTON_DOWNLOAD]: 'download',
    [ToolbarItemTypeEnum.BUTTON_EDIT]: 'edit',
    [ToolbarItemTypeEnum.BUTTON_EMAIL]: 'email',
    [ToolbarItemTypeEnum.BUTTON_EXCEL_LOAD]: 'loadFromExcel',
    [ToolbarItemTypeEnum.BUTTON_INFO]: 'info',
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

  constructor(
    private store: Store<IAppState>,
  ) {}

  getButtonType(item: IToolbarItem): IButtonType {
    return this.defaultItems[item.type];
  }

  isButton(item: IToolbarItem): boolean {
    return item.type === ToolbarItemTypeEnum.BUTTON || Object.keys(this.defaultItems).includes(String(item.type));
  }

  isCheckbox(item: IToolbarItem): boolean {
    return item.type === ToolbarItemTypeEnum.CHECKBOX;
  }

  onClick(item: IToolbarItem): void {
    if (item.closeOnClick && this.dropdown) {
      this.dropdown.close();
    }
    doOnceIf(this.isDisabled(item).map(invert), () => {
      if (typeof item.action === 'function') {
        item.action();
      } else if (item.action) {
        this.store.dispatch(item.action);
      }
      this.action.emit(item);
    });
  }

  isDisabled(item: IToolbarItem): Observable<boolean> {
    return item.enabled ? item.enabled.map(enabled => !enabled) : of(false);
  }

  getItemCls(item: IToolbarItem): object {
    return {
      'align-right': item.align === 'right'
    };
  }
}
