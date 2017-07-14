import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { IAppState } from '../../../core/state/state.interface';
import { IToolbarItem, IToolbarButton, ToolbarItemTypeEnum, IToolbarDefaultElement } from './toolbar-2.interface';

@Component({
  selector: 'app-toolbar-2',
  templateUrl: './toolbar-2.component.html',
  styleUrls: [ './toolbar-2.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Toolbar2Component {
  @Input() items: Array<IToolbarItem> = [];

  defaultItems: { [ToolbarItemTypeEnum: number]: IToolbarDefaultElement } = {
    [ToolbarItemTypeEnum.BUTTON_ADD]: {
      label: 'toolbar.action.add',
      icon: 'fa fa-plus',
    },
    [ToolbarItemTypeEnum.BUTTON_EDIT]: {
      label: 'toolbar.action.edit',
      icon: 'fa fa-pencil',
    },
    [ToolbarItemTypeEnum.BUTTON_SAVE]: {
      label: 'toolbar.action.save',
      icon: 'fa fa-save',
    },
    [ToolbarItemTypeEnum.BUTTON_DELETE]: {
      label: 'toolbar.action.remove',
      icon: 'fa fa-trash',
    },
    [ToolbarItemTypeEnum.BUTTON_REFRESH]: {
      label: 'toolbar.action.refresh',
      icon: 'fa fa-refresh',
    },
    [ToolbarItemTypeEnum.BUTTON_SMS]: {
      label: 'toolbar.action.sms',
      icon: 'fa fa-envelope',
    },
    [ToolbarItemTypeEnum.BUTTON_MOVE]: {
      label: 'toolbar.action.move',
      icon: 'fa fa-share',
    },
    [ToolbarItemTypeEnum.BUTTON_DOWNLOAD]: {
      label: 'toolbar.action.download',
      icon: 'fa fa-cloud-download',
    },
    [ToolbarItemTypeEnum.BUTTON_UPLOAD]: {
      label: 'toolbar.action.upload',
      icon: 'fa fa-cloud-upload',
    },
  };

  buttonTypes: Array<ToolbarItemTypeEnum> = [
    ToolbarItemTypeEnum.BUTTON,
    ToolbarItemTypeEnum.BUTTON_ADD,
    ToolbarItemTypeEnum.BUTTON_EDIT,
    ToolbarItemTypeEnum.BUTTON_SAVE,
    ToolbarItemTypeEnum.BUTTON_DELETE,
    ToolbarItemTypeEnum.BUTTON_REFRESH,
    ToolbarItemTypeEnum.BUTTON_SMS,
    ToolbarItemTypeEnum.BUTTON_MOVE,
    ToolbarItemTypeEnum.BUTTON_DOWNLOAD,
    ToolbarItemTypeEnum.BUTTON_UPLOAD,
  ];

  constructor(
    private store: Store<IAppState>,
  ) {}

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

  getIcon(item: IToolbarButton): string {
    return item.icon || this.defaultItems[item.type].icon;
  }

  getLabel(item: IToolbarButton): string {
    return item.label || this.defaultItems[item.type].label;
  }

  isDisabled(item: IToolbarItem): Observable<boolean> {
    return item.enabled ? item.enabled.map(enabled => !enabled) : Observable.of(false);
  }
}
