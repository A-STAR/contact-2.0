import {
  Component,
  ChangeDetectionStrategy,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { IContextMenuItem, IGridColumn } from '../grid.interface';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContextMenuComponent implements OnInit {
  @Input() tableRow: any;
  @Input() columns: IGridColumn[];
  @Input() fieldNameTranslation: { field: string };
  @Input() options: IContextMenuItem[];
  @Input() styles: CSSStyleDeclaration;

  @Output() action = new EventEmitter<any>();

  actionItems: IContextMenuItem[];
  fieldActionItems: IContextMenuItem[];

  constructor(private translationService: TranslateService) { }

  ngOnInit(): void {
    if (this.options && this.options.length) {
      this.fieldActionItems = this.options
        .filter(option => option.fieldActions && option.fieldActions.length)
        .reduce((acc, option) => {
          option.fieldActions.forEach(name => {
            acc.push({
              ...option,
              fieldAction: name,
              label: this.translationService.instant(option.translationKey + '.' + name, this.fieldNameTranslation)
                || option.label
            });
          });
          return acc;
        }, []);
      this.actionItems = this.options.filter(option => !option.fieldActions);
    }
  }

  onCtxMenuClick(event: MouseEvent, item: IContextMenuItem): void {
    const isCopyField = item.fieldAction === 'copyField';
    const data = isCopyField ? this.tableRow[item.prop] : this.tableRow;

    const copyAsPlaintext = (content) => {
      const copyFrom = document.createElement('textarea');
      copyFrom.textContent = content;
      const body = document.querySelector('body');
      body.appendChild(copyFrom);
      copyFrom.select();

      document.execCommand('copy');
      body.removeChild(copyFrom);
    };

    const formattedData = isCopyField
      ? data
      : this.columns
          .filter(column => data[column.prop] !== null)
          .map(column => {
            return column.type === 'boolean'
              ? Boolean(data[column.prop])
              : column.$$valueGetter && column.dictCode
                ? column.$$valueGetter(data, column.prop)
                : data[column.prop];
          })
          .join('\t');

    copyAsPlaintext(formattedData);
  }

  isDisabled(item: IContextMenuItem): Observable<boolean> {
    return item.enabled ? item.enabled.map(enabled => !enabled) : Observable.of(false);
  }

  onAction(item: IContextMenuItem): void {
    if (item.action) {
      item.action(item.label);
    }
    if (this.action) {
      this.action.emit();
    }
  }

}
