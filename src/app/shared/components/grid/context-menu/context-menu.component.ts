import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewEncapsulation
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { TranslateService } from '@ngx-translate/core';

import { IContextMenuItem, IGridColumn } from '../grid.interface';

@Component({
  selector: 'app-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ContextMenuComponent implements OnInit {
  @Input() tableRow: any;
  @Input() columns: IGridColumn[];
  @Input() ctxFieldNameTranslation: { field: string };
  @Input() options: IContextMenuItem[];
  @Input() ctxStyles: CSSStyleDeclaration;
  @Output() action = new EventEmitter<any>();

  actionItems: IContextMenuItem[];
  fieldActionItems: IContextMenuItem[];

  constructor(private translationService: TranslateService) { }

  ngOnInit(): void {
    if (this.options && this.options.length) {
      this.fieldActionItems = this.options.filter(option => option.fieldActions && option.fieldActions.length)
        .reduce((acc, option) => {
          option.fieldActions.forEach(name => {
            acc.push({
              ...option,
              fieldAction: name,
              name: this.translationService.instant(option.translationKey + '.' + name, this.ctxFieldNameTranslation)
                || option.name
            });
          });
          return acc;
        }, []);
      this.actionItems = this.options.filter(option => !option.fieldActions);
    }
  }

  onAction($event: any): void {
    this.action.emit($event);
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

}
