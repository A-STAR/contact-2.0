import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { defaultTo } from 'ramda';
import { of } from 'rxjs/observable/of';

import { IButtonType } from '../button/button.interface';
import { ITitlebar, ITitlebarItem, TitlebarItemTypeEnum, ITitlebarButton } from './titlebar.interface';

import { doOnceIf } from '@app/core/utils';

@Component({
  selector: 'app-titlebar',
  templateUrl: './titlebar.component.html',
  styleUrls: [ './titlebar.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TitlebarComponent implements OnChanges, OnInit {
  @Input() titlebar: ITitlebar;

  @Output() action = new EventEmitter<ITitlebarItem>();

  borderCls: object;
  items: ITitlebarItem[] = [];
  props: { [key: string]: Partial<ITitlebarButton> } = {
    [TitlebarItemTypeEnum.BUTTON_ADD]: { iconCls: 'co-add', title: 'Добавить' },
    [TitlebarItemTypeEnum.BUTTON_COPY]: { iconCls: 'co-copy', title: 'Копировать' },
    [TitlebarItemTypeEnum.BUTTON_CHANGE_STATUS]: { iconCls: 'co-change-status', title: 'Изменить статус' },
    [TitlebarItemTypeEnum.BUTTON_DELETE]: { iconCls: 'co-delete', title: 'Удалить' },
    [TitlebarItemTypeEnum.BUTTON_DEBT_CARD]: { iconCls: 'co-debt-list', title: 'Карточка должника' },
    [TitlebarItemTypeEnum.BUTTON_DOWNLOAD]: { iconCls: 'co-download', title: 'Выгрузить' },
    [TitlebarItemTypeEnum.BUTTON_DOWNLOAD_EXCEL]: { iconCls: 'co-download-excel', title: 'Выгрузить в Excel' },
    [TitlebarItemTypeEnum.BUTTON_EDIT]: { iconCls: 'co-edit', title: 'Редактировать' },
    [TitlebarItemTypeEnum.BUTTON_FILTER]: { iconCls: 'co-filter', title: 'default.buttons.filter' },
    [TitlebarItemTypeEnum.BUTTON_MOVE]: { iconCls: 'co-move', title: 'Переместить' },
    [TitlebarItemTypeEnum.BUTTON_REFRESH]: { iconCls: 'co-refresh', title: 'Обновить' },
    [TitlebarItemTypeEnum.BUTTON_REGISTER_CONTACT]: { iconCls: 'co-contact-registration', title: 'Зарегистрировать контакт' },
    [TitlebarItemTypeEnum.BUTTON_SEARCH]: { iconCls: 'co-search', title: 'Поиск' },
    [TitlebarItemTypeEnum.BUTTON_START]: { iconCls: 'co-start', title: 'Запустить' },
    [TitlebarItemTypeEnum.BUTTON_STOP]: { iconCls: 'co-stop', title: 'Остановить' },
  };
  suppressCenterZone: boolean;
  title: string;

  constructor(
    private cdRef: ChangeDetectorRef,
  ) {}

  ngOnChanges(): void {
    this.title = this.titlebar.title;
    this.cdRef.markForCheck();
  }

  ngOnInit(): void {
    const enabledDefault = defaultTo(of(true));
    this.borderCls = { 'no-border': this.titlebar.suppressBorder === true };
    this.items = (this.titlebar.items || this.items).map(item => ({
      ...item,
      enabled: enabledDefault(item.enabled)
    }));
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
    doOnceIf(item.enabled, () => {
      if (typeof item.action === 'function') {
        item.action();
      }
      this.action.emit(item);
    });
  }

  /**
   * Get the icon's css class, or show an exclamation if the icon class is not listed
   * @param item {ITitlebarButton}
   */
  getIconCls(item: ITitlebarButton): object {
    const prop = this.props[item.type];
    const iconCls = item.iconCls || (prop && prop.iconCls) || 'co-dialog-exclamation';
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
