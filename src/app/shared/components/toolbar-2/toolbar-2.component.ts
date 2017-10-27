import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { IAppState } from '../../../core/state/state.interface';
import { IButtonType } from '../button/button.interface';
import { IToolbarItem, IToolbarButton, ToolbarItemTypeEnum } from './toolbar-2.interface';

@Component({
  selector: 'app-toolbar-2',
  templateUrl: './toolbar-2.component.html',
  styleUrls: [ './toolbar-2.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Toolbar2Component {
  @Input() items: Array<IToolbarItem> = [];
  @Output() action = new EventEmitter<IToolbarItem>();

  defaultItems: { [ToolbarItemTypeEnum: number]: IButtonType } = {
    [ToolbarItemTypeEnum.BUTTON_ADD]: 'add',
    [ToolbarItemTypeEnum.BUTTON_EDIT]: 'edit',
    [ToolbarItemTypeEnum.BUTTON_SAVE]: 'save',
    [ToolbarItemTypeEnum.BUTTON_DELETE]: 'delete',
    [ToolbarItemTypeEnum.BUTTON_REFRESH]: 'refresh',
    [ToolbarItemTypeEnum.BUTTON_SMS]: 'sms',
    [ToolbarItemTypeEnum.BUTTON_MOVE]: 'move',
    [ToolbarItemTypeEnum.BUTTON_DOWNLOAD]: 'download',
    [ToolbarItemTypeEnum.BUTTON_UPLOAD]: 'upload',
    [ToolbarItemTypeEnum.BUTTON_BLOCK]: 'block',
    [ToolbarItemTypeEnum.BUTTON_UNBLOCK]: 'unblock',
    [ToolbarItemTypeEnum.BUTTON_CHANGE_STATUS]: 'changeStatus',
    [ToolbarItemTypeEnum.BUTTON_CLOSE]: 'close',
    [ToolbarItemTypeEnum.BUTTON_UNDO]: 'undo',
    [ToolbarItemTypeEnum.BUTTON_OK]: 'ok',
    [ToolbarItemTypeEnum.BUTTON_REGISTER_CALL]: 'registerContact',
    [ToolbarItemTypeEnum.BUTTON_VISIT]: 'visit'
  };

  constructor(
    private store: Store<IAppState>,
  ) {}

  getButtonType(item: IToolbarItem): IButtonType {
    return this.defaultItems[item.type];
  }

  isButton(item: IToolbarItem): boolean {
    return item.type === ToolbarItemTypeEnum.BUTTON || Object.keys(this.defaultItems).map(Number).includes(item.type as number);
  }

  isCheckbox(item: IToolbarItem): boolean {
    return item.type === ToolbarItemTypeEnum.CHECKBOX;
  }

  onClick(item: IToolbarItem): void {
    if (typeof item.action === 'function') {
      item.action();
    } else if (item.action) {
      this.store.dispatch(item.action);
    }
    this.action.emit(item);
  }

  isDisabled(item: IToolbarItem): Observable<boolean> {
    return item.enabled ? item.enabled.map(enabled => !enabled) : Observable.of(false);
  }
}
