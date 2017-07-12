import { Component } from '@angular/core';

import { IDebtor } from './debtor/debtor.interface';
import {
  IGridColumn,
  IRenderer
} from '../../../shared/components/grid/grid.interface';
import {
  IToolbarItem,
  ToolbarItemTypeEnum
} from '../../../shared/components/toolbar-2/toolbar-2.interface';

import { DebtorsService } from './debtors.service';
import { ObservableHelper } from '../../../core/observable/ObservableHelper';
import { toFullName } from '../../../core/utils';
import { GridService } from '../../../shared/components/grid/grid.service';

@Component({
  selector: 'app-debtors',
  templateUrl: './debtors.component.html',
})
export class DebtorsComponent {
  static COMPONENT_NAME = 'DebtorsComponent';

  private selectedDebtor: IDebtor;

  debtors: IDebtor[];

  columns: Array<IGridColumn> = [
    { prop: 'id', maxWidth: 80 },
    { prop: 'debtId', maxWidth: 130 },
    { prop: 'fullName' },
    { prop: 'type', maxWidth: 180},
    { prop: 'product' },
    { prop: 'city', maxWidth: 140 }
  ];

  renderers: IRenderer = {
    fullName: toFullName,
    type: [
      // TODO(a.poterenko) STUB
      { value: 1, label: 'Physical person' },
      { value: 2, label: 'Juridical person' },
    ]
  };

  toolbarItems: Array<IToolbarItem> = [
    {
      type: ToolbarItemTypeEnum.BUTTON_EDIT,
      action: () => this.debtorsService.showDebtor(this.selectedDebtor.id),
      enabled: this.debtorsService.selectedDebtor.map(debtor => !!debtor)
    },
  ];

  constructor(
    private debtorsService: DebtorsService,
    private gridService: GridService
  ) {
    this.columns = this.gridService.setRenderers(this.columns, this.renderers);

    ObservableHelper.subscribe(
      debtorsService.debtors.subscribe(debtors => this.debtors = debtors),
      this
    );
  }

  onDblClick(debtor: IDebtor): void {
    this.debtorsService.showDebtor(debtor.id);
  }

  onSelect(debtor: IDebtor): void {
    this.debtorsService.selectDebtor(this.selectedDebtor = debtor);
  }
}
