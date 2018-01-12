import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild } from '@angular/core';

import { IGridDef, IInfoDebtEntry } from './info-debt.interface';

import { ActionGridComponent } from '../../../shared/components/action-grid/action-grid.component';

import { makeKey } from '../../../core/utils';

const label = makeKey('modules.infoDebt');

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-info-debt',
  templateUrl: 'info-debt.component.html',
})
export class InfoDebtComponent {
  @ViewChild(ActionGridComponent) grid: ActionGridComponent<IInfoDebtEntry>;

  rows: IInfoDebtEntry[] = [];
  rowCount = 0;
  selectedTabIndex = 0;

  grids: IGridDef[] = [
    { rowIdKey: 'debtId', key: 'workTask.NewDebt', title: label('debtors.title'), isInitialised: true },
    { rowIdKey: 'debtId', key: 'workTask.ProblemDebt', title: label('guarantors.title'), isInitialised: false },
    { rowIdKey: 'debtId', key: 'workTask.DebtToContractor', title: label('pledgors.title'), isInitialised: false },
  ];

  constructor(private cdRef: ChangeDetectorRef) { }

  onTabSelect(tabIndex: number): void {
    this.grids[tabIndex].isInitialised = true;
    this.selectedTabIndex = tabIndex;
    this.cdRef.markForCheck();
  }
}
