import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { IPerson } from '../debt-processing/debtor/debtor.interface';
import { IGridColumn, IRenderer } from '../../../shared/components/grid/grid.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '../../../shared/components/toolbar-2/toolbar-2.interface';

import { DebtorsService } from './debtors.service';
import { toFullName } from '../../../core/utils';
import { GridService } from '../../../shared/components/grid/grid.service';

@Component({
  selector: 'app-debtors',
  templateUrl: './debtors.component.html',
})
export class DebtorsComponent implements OnDestroy {
  static COMPONENT_NAME = 'DebtorsComponent';

  private selectedDebtor: IPerson;

  debtors: IPerson[];
  debtorsSub: Subscription;

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
      // TODO(a.tymchuk) STUB
      { value: 1, label: 'Physical person' },
      { value: 2, label: 'Legal entity' },
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
    this.debtorsService.fetchDebtors();
    this.debtorsSub = debtorsService.debtors.subscribe(debtors => this.debtors = debtors);
  }

  ngOnDestroy(): void {
    this.debtorsSub.unsubscribe();
  }

  onDblClick(debtor: IPerson): void {
    this.debtorsService.showDebtor(debtor.id);
  }

  onSelect(debtor: IPerson): void {
    this.debtorsService.selectDebtor(this.selectedDebtor = debtor);
  }
}
