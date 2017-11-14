import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { IGridColumn } from '../../../../shared/components/grid/grid.interface';

import { DebtorGridService } from './debtor-grid.service';
import { GridService } from '../../../../shared/components/grid/grid.service';
import { IncomingCallService } from '../incoming-call.service';
import { UserDictionariesService } from '../../../../core/user/dictionaries/user-dictionaries.service';

@Component({
  selector: 'app-incoming-call-debtor-grid',
  templateUrl: 'debtor-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DebtorGridComponent implements OnInit, OnDestroy {
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

  debtors: any[] = [];

  private searchParamsSubscription: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private debtorGridService: DebtorGridService,
    private gridService: GridService,
    private incomingCallService: IncomingCallService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.gridService.setDictionaryRenderers(this.columns)
      .take(1)
      .subscribe(columns => {
        this.columns = this.gridService.setRenderers(columns);
      });

    this.searchParamsSubscription = this.incomingCallService.searchParams$
      .filter(Boolean)
      .flatMap(params => this.debtorGridService.fetchAll(params))
      .subscribe(debtors => {
        this.debtors = debtors;
        this.cdRef.markForCheck();
      });
  }

  ngOnDestroy(): void {
    this.searchParamsSubscription.unsubscribe();
  }

  onSelect(debtor: any): void {
    this.incomingCallService.selectedDebtor = debtor;
  }

  onDoubleClick(debtor: any): void {
    this.router.navigate([ `/workplaces/debt-processing/${debtor.debtorId}/${debtor.debtId}/` ]).then(() => {
      const nextUrl = this.getUrlByDebtor(debtor);
      if (nextUrl) {
        this.router.navigate([ nextUrl ]);
      }
    });
  }

  private getUrlByDebtor(debtor: any): string {
    switch (debtor.personRole) {
      case 2:
        return `/workplaces/debt-processing/${debtor.debtorId}/${debtor.debtId}/guaranteeContract/edit`;
      case 3:
        // TODO(d.maltsev): return correct url when the module is finished
        // See: http://confluence.luxbase.int:8090/pages/viewpage.action?pageId=133529625#id-Входящийзвонок-Открытиекарточки
        return null;
      case 4:
        return `/workplaces/debt-processing/${debtor.debtorId}/${debtor.debtId}/contact/${debtor.personId}`;
    }
  }
}
