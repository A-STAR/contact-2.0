import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { IGridColumn } from '../../../../shared/components/grid/grid.interface';

import { GridService } from '../../../../shared/components/grid/grid.service';
import { UserDictionariesService } from '../../../../core/user/dictionaries/user-dictionaries.service';

@Component({
  selector: 'app-incoming-call-debtors-grid',
  templateUrl: 'debtors-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DebtorsGridComponent implements OnInit {
  columns: IGridColumn[] = [
    { prop: 'debtId', minWidth: 100 },
    { prop: 'debtorId', minWidth: 100 },
    { prop: 'fullName', minWidth: 150 },
    { prop: 'contact', minWidth: 100 },
    { prop: 'docNumber', minWidth: 150 },
    { prop: 'personRole', minWidth: 100, dictCode: UserDictionariesService.DICTIONARY_PERSON_ROLE },
    { prop: 'personId', minWidth: 100 },
    { prop: 'creditTypeCode', minWidth: 100, dictCode: UserDictionariesService.DICTIONARY_PRODUCT_TYPE },
    { prop: 'creditName', minWidth: 150 },
    { prop: 'bankName', minWidth: 100 },
    { prop: 'portfolioName', minWidth: 150 },
    { prop: 'outPortfolioName', minWidth: 200 },
    { prop: 'debtAmount', minWidth: 100, renderer: 'numberRenderer' },
    { prop: 'currencyName', minWidth: 100 },
    { prop: 'statusCode', minWidth: 100, dictCode: UserDictionariesService.DICTIONARY_DEBT_STATUS },
    { prop: 'regionCode', minWidth: 100, dictCode: UserDictionariesService.DICTIONARY_REGIONS },
    { prop: 'branchCode', minWidth: 100, dictCode: UserDictionariesService.DICTIONARY_BRANCHES },
    { prop: 'startDate', minWidth: 200, renderer: 'dateRenderer' },
    { prop: 'creditStartDate', minWidth: 150, renderer: 'dateRenderer' },
    { prop: 'creditEndDate', minWidth: 220, renderer: 'dateRenderer' },
  ];

  debtors: any[] = [
    {
      debtId: 1
    }
  ];

  constructor(
    private cdRef: ChangeDetectorRef,
    private gridService: GridService,
  ) {}

  ngOnInit(): void {
    this.gridService.setDictionaryRenderers(this.columns)
      .take(1)
      .subscribe(columns => {
        this.columns = this.gridService.setRenderers(columns);
      });
  }

  onSelect(debtor: any): void {

  }

  onDoubleClick(debtor: any): void {

  }
}
