import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { of } from 'rxjs/observable/of';
import { Observable } from 'rxjs/Observable';

import { IAppState } from '@app/core/state/state.interface';
import { IButtonType } from '../../button/button.interface';
import { ITitlebarItem, TitlebarItemTypeEnum } from './titlebar.interface';

import { doOnceIf, invert } from '@app/core/utils';

@Component({
  selector: 'app-form-titlebar',
  templateUrl: './titlebar.component.html',
  styleUrls: [ './titlebar.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormToolbarComponent {
  @Input() items: ITitlebarItem[] = [];
  @Output() action = new EventEmitter<ITitlebarItem>();

  defaultItems: { [TitlebarItemTypeEnum: number]: IButtonType } = {
    [TitlebarItemTypeEnum.BUTTON_ADD]: 'add',
    [TitlebarItemTypeEnum.BUTTON_ADD_USER]: 'addUser',
    [TitlebarItemTypeEnum.BUTTON_BLOCK]: 'block',
    [TitlebarItemTypeEnum.BUTTON_CHANGE_STATUS]: 'changeStatus',
    [TitlebarItemTypeEnum.BUTTON_CLOSE]: 'close',
    [TitlebarItemTypeEnum.BUTTON_COPY]: 'copy',
    [TitlebarItemTypeEnum.BUTTON_DELETE]: 'delete',
    [TitlebarItemTypeEnum.BUTTON_DOWNLOAD]: 'download',
    [TitlebarItemTypeEnum.BUTTON_EDIT]: 'edit',
    [TitlebarItemTypeEnum.BUTTON_EMAIL]: 'email',
    [TitlebarItemTypeEnum.BUTTON_EXCEL_LOAD]: 'loadFromExcel',
    [TitlebarItemTypeEnum.BUTTON_MOVE]: 'move',
    [TitlebarItemTypeEnum.BUTTON_NEXT]: 'next',
    [TitlebarItemTypeEnum.BUTTON_OK]: 'ok',
    [TitlebarItemTypeEnum.BUTTON_REFRESH]: 'refresh',
    [TitlebarItemTypeEnum.BUTTON_REGISTER_CONTACT]: 'registerContact',
    [TitlebarItemTypeEnum.BUTTON_SAVE]: 'save',
    [TitlebarItemTypeEnum.BUTTON_SMS]: 'sms',
    [TitlebarItemTypeEnum.BUTTON_START]: 'start',
    [TitlebarItemTypeEnum.BUTTON_STOP]: 'stop',
    [TitlebarItemTypeEnum.BUTTON_UNBLOCK]: 'unblock',
    [TitlebarItemTypeEnum.BUTTON_UNDO]: 'undo',
    [TitlebarItemTypeEnum.BUTTON_UPLOAD]: 'upload',
    [TitlebarItemTypeEnum.BUTTON_VERSION]: 'version',
    [TitlebarItemTypeEnum.BUTTON_VISIT]: 'visit',
  };

  constructor(
    private store: Store<IAppState>,
  ) {}

  getButtonType(item: ITitlebarItem): IButtonType {
    return this.defaultItems[item.type];
  }

  isButton(item: ITitlebarItem): boolean {
    return item.type === TitlebarItemTypeEnum.BUTTON || !!this.defaultItems[String(item.type)];
  }

  isCheckbox(item: ITitlebarItem): boolean {
    return item.type === TitlebarItemTypeEnum.CHECKBOX;
  }

  onClick(item: ITitlebarItem): void {
    doOnceIf(this.isDisabled(item).map(invert), () => {
      if (typeof item.action === 'function') {
        item.action();
      } else if (item.action) {
        this.store.dispatch(item.action);
      }
      this.action.emit(item);
    });
  }

  isDisabled(item: ITitlebarItem): Observable<boolean> {
    return item.enabled ? item.enabled.map(enabled => !enabled) : of(false);
  }

  getItemCls(item: ITitlebarItem): object {
    return {
      'align-right': item.align === 'right'
    };
  }
}
