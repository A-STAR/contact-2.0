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

import { ITitlebar, ITitlebarItem, TitlebarItemTypeEnum, ITitlebarButton } from './titlebar.interface';

import { doOnceIf } from '@app/core/utils';
import { IconType } from '@app/shared/components/icons/icons.interface';

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
    [ButtonType.ADD]: { iconCls: 'co-add', title: 'Добавить' },
    [ButtonType.COPY]: { iconCls: 'co-copy', title: 'Копировать' },
    [ButtonType.CLOSE]: { iconCls: 'co-close', title: 'default.buttons.close' },
    [ButtonType.CHANGE_STATUS]: { iconCls: 'co-change-status', title: 'Изменить статус' },
    [ButtonType.DELETE]: { iconCls: 'co-delete', title: 'Удалить' },
    // TODO(d.maltsev): we need a better icon here
    [ButtonType.DEBT_CARD]: { iconCls: 'co-edit', title: 'Карточка должника' },
    [ButtonType.DOWNLOAD]: { iconCls: 'co-download', title: 'Выгрузить' },
    [ButtonType.DOWNLOAD_EXCEL]: { iconCls: 'co-download-excel', title: 'Выгрузить в Excel' },
    [ButtonType.EDIT]: { iconCls: 'co-edit', title: 'Редактировать' },
    [ButtonType.FILTER]: { iconCls: 'co-filter', title: 'default.buttons.filter' },
    //  TODO(i.lobanov): replace when icon is ready
    [ButtonType.MAP]: { iconCls: 'co-image', title: 'default.buttons.map' },
    [ButtonType.MOVE]: { iconCls: 'co-move', title: 'Переместить' },
    [ButtonType.REFRESH]: { iconCls: 'co-refresh', title: 'Обновить' },
    [ButtonType.REGISTER_CONTACT]: { iconCls: 'co-contact-registration', title: 'Зарегистрировать контакт' },
    [ButtonType.SEARCH]: { iconCls: 'co-search', title: 'Поиск' },
    [ButtonType.START]: { iconCls: 'co-start', title: 'Запустить' },
    [ButtonType.STOP]: { iconCls: 'co-stop', title: 'Остановить' },
  };
  suppressCenterZone: boolean;
  title: string;

  constructor(
    private cdRef: ChangeDetectorRef,
  ) {}

  ngOnChanges(): void {
    this.title = this.titlebar && this.titlebar.title;
    this.cdRef.markForCheck();
  }

  ngOnInit(): void {
    const classesDefault = defaultTo(of(''));
    const enabledDefault = defaultTo(of(true));
    this.borderCls = { 'no-border': this.titlebar && this.titlebar.suppressBorder === true };
    this.items = ((this.titlebar && this.titlebar.items) || this.items).map(item => ({
      ...item,
      classes: classesDefault(item.classes),
      enabled: enabledDefault(item.enabled),
    }));
    this.suppressCenterZone = (this.titlebar && this.titlebar.suppressCenterZone) || false;
    this.title = (this.titlebar && this.titlebar.title) || '';
  }

  getButtonType(item: ITitlebarItem): IconType {
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
