import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { Subscription } from 'rxjs/Subscription';

import { IGridColumn, IContextMenuItem } from '../../../../shared/components/grid/grid.interface';

import { DebtorCardService } from '../../../../core/app-modules/debtor-card/debtor-card.service';
import { DebtorGridService } from './debtor-grid.service';
import { GridService } from '../../../../shared/components/grid/grid.service';
import { IncomingCallService } from '../incoming-call.service';
import { UserDictionariesService } from '../../../../core/user/dictionaries/user-dictionaries.service';

@Component({
  selector: 'app-incoming-call-debtor-grid',
  templateUrl: 'debtor-grid.component.html',
  host: { class: 'full-height' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DebtorGridComponent implements OnInit, OnDestroy {
  columns: IGridColumn[] = [
    { prop: 'debtId', minWidth: 100 },
    { prop: 'debtorId', minWidth: 100 },
    { prop: 'fullName', minWidth: 150 },
    { prop: 'contract', minWidth: 100 },
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

  debtors: any[];

  contextMenuOptions: IContextMenuItem[] = [
    {
      simpleActionsNames: [
        'copyField',
        'copyRow'
      ],
      translationKey: 'default.grid.localeText',
      prop: 'fullName',
      enabled: of(true)
    },
    {
      action: 'showContactHistory',
      label: 'default.grid.actions.showContactHistory',
      enabled: of(true),
      params: [ 'personId' ],
    },
    {
      action: 'debtSetResponsible',
      label: 'default.grid.actions.debtSetResponsible',
      enabled: of(true),
      params: [ 'debtId' ]
    },
    {
      action: 'debtClearResponsible',
      label: 'default.grid.actions.debtClearResponsible',
      enabled: of(true),
      params: [ 'debtId' ]
    },
    {
      action: 'objectAddToGroup',
      label: 'default.grid.actions.objectAddToGroup',
      enabled: of(true),
      params: [ 'debtId' ],
      // TODO(d.maltsev, i.kibisov): currently using injection instead of this
      addOptions: [
        { name: 'entityTypeId', value: [ 19 ] }
      ]
    },
  ];

  private searchParamsSubscription: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private debtorCardService: DebtorCardService,
    private debtorGridService: DebtorGridService,
    private gridService: GridService,
    private incomingCallService: IncomingCallService,
  ) {}

  ngOnInit(): void {
    this.gridService.setDictionaryRenderers(this.columns)
      .pipe(first())
      .subscribe(columns => {
        this.columns = this.gridService.setRenderers(columns);
      });

    this.searchParamsSubscription = this.incomingCallService.searchParams$
      .flatMap(params => params ? this.debtorGridService.fetchAll(params as any) : of(null))
      .subscribe(debtors => {
        this.debtors = debtors;
        this.incomingCallService.selectedDebtor = null;
        this.cdRef.markForCheck();
      });
  }

  ngOnDestroy(): void {
    this.searchParamsSubscription.unsubscribe();
  }

  onSelect(debtor: any): void {
    this.incomingCallService.selectedDebtor = debtor && debtor[0];
  }

  onDoubleClick(debtor: any): void {
    this.debtorCardService.openByDebtId(debtor.debtId);

    // TODO(d.maltsev):
    // .then(() => {
    //   // TODO(d.maltsev): navigation params???
    //   const nextUrl = this.getUrlByDebtor(debtor);
    //   if (nextUrl) {
    //     this.router.navigate([ nextUrl ]);
    //   }
    // });
  }

  onAction($event: string): void {
    // uncomment to test action for context menu
    // log(`Action was fired for ${$event}`);
  }

  // private getUrlByDebtor(debtor: any): string {
  //   const { debtorId, debtId, contractId, personId } = debtor;
  //   switch (debtor.personRole) {
  //     case 2:
  //       return `/workplaces/debt-processing/${debtorId}/${debtId}/guarantee/${contractId}/guarantor/${personId}`;
  //     case 3:
  //       // TODO(d.maltsev): return correct url when the module is finished
  //       // See: http://confluence.luxbase.int:8090/pages/viewpage.action?pageId=133529625#id-Входящийзвонок-Открытиекарточки
  //       return null;
  //     case 4:
  //       return `/workplaces/debt-processing/${debtorId}/${debtId}/contact/${personId}`;
  //   }
  // }
}
