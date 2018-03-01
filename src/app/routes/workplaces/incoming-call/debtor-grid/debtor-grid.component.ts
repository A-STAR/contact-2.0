import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { of } from 'rxjs/observable/of';
import { Subscription } from 'rxjs/Subscription';

import { IMetadataAction } from '@app/core/metadata/metadata.interface';
import { ISimpleGridColumn } from '@app/shared/components/grids/grid/grid.interface';

import { DebtorCardService } from '@app/core/app-modules/debtor-card/debtor-card.service';
import { DebtorGridService } from './debtor-grid.service';
import { IncomingCallService } from '../incoming-call.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';

import { addGridLabel } from '@app/core/utils';
import { DateRendererComponent, NumberRendererComponent } from '@app/shared/components/grids/renderers';

@Component({
  selector: 'app-incoming-call-debtor-grid',
  templateUrl: 'debtor-grid.component.html',
  host: { class: 'full-height' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DebtorGridComponent implements OnInit, OnDestroy {

  columns: ISimpleGridColumn<any>[] = [
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
    { prop: 'debtAmount', minWidth: 100, renderer: NumberRendererComponent },
    { prop: 'currencyName', minWidth: 100 },
    { prop: 'statusCode', minWidth: 100, dictCode: UserDictionariesService.DICTIONARY_DEBT_STATUS },
    { prop: 'regionCode', minWidth: 100, dictCode: UserDictionariesService.DICTIONARY_REGIONS },
    { prop: 'branchCode', minWidth: 100, dictCode: UserDictionariesService.DICTIONARY_BRANCHES },
    { prop: 'startDate', minWidth: 200, renderer: DateRendererComponent },
    { prop: 'creditStartDate', minWidth: 150, renderer: DateRendererComponent },
    { prop: 'creditEndDate', minWidth: 220, renderer: DateRendererComponent },
  ].map(addGridLabel('modules.incomingCall.debtors.grid'));

  debtors: any[] = [];
  defaultAction = 'openDebtCard';
  actions: IMetadataAction[] = [
    {
      action: 'openDebtCard',
      params: [ 'debtId' ],
    },
    {
      action: 'showContactHistory',
      params: [ 'personId' ],
    },
    {
      action: 'debtSetResponsible',
      applyTo: {
        selected: true,
      },
      params: [ 'debtId' ]
    },
    {
      action: 'debtClearResponsible',
      applyTo: {
        selected: true,
      },
      params: [ 'debtId' ]
    },
    {
      action: 'objectAddToGroup',
      params: [ 'debtId' ],
      applyTo: {
        selected: true,
      },
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
    private incomingCallService: IncomingCallService,
  ) {}

  ngOnInit(): void {

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
    // console.log($event);
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
