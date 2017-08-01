import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { IGridColumn } from '../../../../../shared/components/grid/grid.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '../../../../../shared/components/toolbar-2/toolbar-2.interface';

@Component({
  selector: 'app-email-grid',
  templateUrl: './email-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmailGridComponent {
  toolbarItems: Array<IToolbarItem> = [
    {
      type: ToolbarItemTypeEnum.BUTTON_ADD,
      enabled: Observable.of(true),
      action: () => {}
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_EDIT,
      enabled: Observable.of(true),
      action: () => {}
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_DELETE,
      enabled: Observable.of(true),
      action: () => {}
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_REFRESH,
      enabled: Observable.of(true),
      action: () => {}
    }
  ];

  columns: Array<IGridColumn> = [
    { prop: 'typeCode' },
    { prop: 'email' },
    { prop: 'isBlocked' },
    { prop: 'blockReasonCode' },
    { prop: 'blockDateTime' },
  ];

  private _emails: Array<any>;

  get emails(): Array<any> {
    return this._emails;
  }

  onDoubleClick(event: any): void {
    //
  }

  onSelect(event: any): void {
    //
  }
}
