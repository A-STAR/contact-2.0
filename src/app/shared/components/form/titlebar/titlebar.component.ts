import { Component, EventEmitter, Input, OnInit, Output, ChangeDetectionStrategy } from '@angular/core';
import { of } from 'rxjs/observable/of';
import { Observable } from 'rxjs/Observable';

import { IAppState } from '@app/core/state/state.interface';
import { IButtonType } from '../../button/button.interface';
import { ITitlebar, ITitlebarItem, TitlebarItemTypeEnum, ITitlebarButton } from './titlebar.interface';

import { doOnceIf, invert } from '@app/core/utils';

@Component({
  selector: 'app-titlebar',
  templateUrl: './titlebar.component.html',
  styleUrls: [ './titlebar.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TitlebarComponent implements OnInit {
  @Input() titlebar: ITitlebar;

  @Output() action = new EventEmitter<ITitlebarItem>();

  title: string;
  items: ITitlebarItem[] = [];
  props: any = {
    [TitlebarItemTypeEnum.BUTTON_ADD]: { iconCls: 'fa-plus', title: 'Добавить' },
    [TitlebarItemTypeEnum.BUTTON_EDIT]: { iconCls: 'fa-pencil', title: 'Редактировать' },
    [TitlebarItemTypeEnum.BUTTON_DELETE]: { iconCls: 'fa-trash', title: 'Удалить' },
    [TitlebarItemTypeEnum.BUTTON_DOWNLOAD_EXCEL]: { iconCls: 'fa-file-excel-o', title: 'Выгрузить в Excel' },
    [TitlebarItemTypeEnum.BUTTON_REFRESH]: { iconCls: 'fa-refresh', title: 'Обновить' },
    [TitlebarItemTypeEnum.BUTTON_SEARCH]: { iconCls: 'fa-search', title: 'Поиск' },
  };

  ngOnInit(): void {
    this.title = this.titlebar.title;
    this.items = this.titlebar.items || this.items;
  }

  getButtonType(item: ITitlebarItem): IButtonType {
    return TitlebarItemTypeEnum[item.type];
  }

  isButton(item: ITitlebarItem): boolean {
    return !!TitlebarItemTypeEnum[item.type];
  }

  isCheckbox(item: ITitlebarItem): boolean {
    return item.type === TitlebarItemTypeEnum.CHECKBOX;
  }

  onClick(item: ITitlebarItem): void {
    doOnceIf(this.isDisabled(item).map(invert), () => {
      if (typeof item.action === 'function') {
        item.action();
      }
      this.action.emit(item);
    });
  }

  isDisabled(item: ITitlebarItem): Observable<boolean> {
    return item.enabled ? item.enabled.map(enabled => !enabled) : of(false);
  }

  getIconCls(item: ITitlebarButton): object {
    const iconCls = item.iconCls || this.props[item.type].iconCls;
    const cls = { 'align-right': item.align === 'right' };
    return iconCls
      ? { ...cls, [iconCls]: true }
      : cls;
  }
}
