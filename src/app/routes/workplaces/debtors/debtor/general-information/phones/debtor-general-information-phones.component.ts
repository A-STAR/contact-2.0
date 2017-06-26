import {
  Component,
  Input
} from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IGridColumn, IRenderer } from '../../../../../../shared/components/grid/grid.interface';
import {
  IToolbarItem,
  ToolbarItemTypeEnum
} from '../../../../../../shared/components/toolbar-2/toolbar-2.interface';

import { GridService } from '../../../../../../shared/components/grid/grid.service';

@Component({
  selector: 'app-debtor-general-information-phones',
  templateUrl: './debtor-general-information-phones.component.html',
})
export class DebtorGeneralInformationPhonesComponent {

  @Input() rows;

  columns: Array<IGridColumn> = [
    { prop: 'type' },
    { prop: 'number' },
    { prop: 'status' },
    { prop: 'lastCall' },
    { prop: 'contactPerson' },
    { prop: 'comment' },
    { prop: 'region' },
    { prop: 'active' },
    { prop: 'qualityCode' },
    { prop: 'numberExists' },
    { prop: 'verified' },
    { prop: 'blockingDate' },
    { prop: 'blockingReason' },
  ];

  renderers: IRenderer = {
    type: [
      { label: 'Home phone', value: 1 },
      { label: 'Work phone', value: 2 },
      { label: 'Mobile phone', value: 3 },
    ],
    status: [
      { label: 'Did not call at all', value: 1 },
    ],
    active: [
      { label: 'TRUE', value: 1 },
    ],
    numberExists: [
      { label: 'TRUE', value: 1 },
    ],
    verified: [
      { label: 'TRUE', value: 1 },
    ],
  };

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
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_SMS,
      enabled: Observable.of(true),
      action: () => {}
    }
  ];

  constructor(private gridService: GridService) {
    this.columns = this.gridService.setRenderers(this.columns, this.renderers);
  }
}
