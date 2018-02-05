import { Component, EventEmitter, Input, OnInit, Output, ChangeDetectionStrategy } from '@angular/core';
import { of } from 'rxjs/observable/of';
import { Observable } from 'rxjs/Observable';

import { IButtonType } from '../button/button.interface';
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

  borderCls: object;
  items: ITitlebarItem[] = [];
  props: { [key: string]: Partial<ITitlebarButton> } = {
    [TitlebarItemTypeEnum.BUTTON_ADD]: { iconCls: 'fa-plus', title: 'Добавить' },
    [TitlebarItemTypeEnum.BUTTON_COPY]: { iconCls: 'fa-copy', title: 'Копировать' },
    [TitlebarItemTypeEnum.BUTTON_CHANGE_STATUS]: { iconCls: 'fa-random', title: 'Изменить статус' },
    [TitlebarItemTypeEnum.BUTTON_DELETE]: { iconCls: 'fa-trash', title: 'Удалить' },
    [TitlebarItemTypeEnum.BUTTON_EDIT]: { iconCls: 'fa-pencil', title: 'Редактировать' },
    [TitlebarItemTypeEnum.BUTTON_DOWNLOAD_EXCEL]: { iconCls: 'fa-file-excel-o', title: 'Выгрузить в Excel' },
    [TitlebarItemTypeEnum.BUTTON_MOVE]: { iconCls: 'fa-share', title: 'Переместить' },
    [TitlebarItemTypeEnum.BUTTON_REFRESH]: { iconCls: 'fa-refresh', title: 'Обновить' },
    [TitlebarItemTypeEnum.BUTTON_REGISTER_CONTACT]: { iconCls: 'fa-tty', title: 'Зарегистрировать контакт' },
    [TitlebarItemTypeEnum.BUTTON_SEARCH]: { iconCls: 'fa-search', title: 'Поиск' },
  };
  suppressCenterZone: boolean;
  title: string;

  ngOnInit(): void {
    this.borderCls = { 'no-border': this.titlebar.suppressBorder === true };
    this.items = this.titlebar.items || this.items;
    this.suppressCenterZone = this.titlebar.suppressCenterZone || false;
    this.title = this.titlebar.title;
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

  /**
   * Get the icon's css class, or show an exclamation if the icon class is not listed
   * @param item {ITitlebarButton}
   */
  getIconCls(item: ITitlebarButton): object {
    const prop = this.props[item.type];
    const iconCls = item.iconCls || (prop && prop.iconCls) || 'fa-exclamation';
    const cls = { 'align-right': item.align === 'right' };
    return iconCls
      ? { ...cls, [iconCls]: true }
      : cls;
  }

  getTitle(item: ITitlebarButton): string {
    const prop = this.props[item.type];
    return item.title || (prop && prop.title) || null;
  }
}