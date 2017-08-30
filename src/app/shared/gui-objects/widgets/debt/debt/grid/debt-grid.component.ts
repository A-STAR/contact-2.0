import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { IDebt } from '../debt.interface';
import { IGridColumn, IRenderer } from '../../../../../../shared/components/grid/grid.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '../../../../../../shared/components/toolbar-2/toolbar-2.interface';

import { DebtService } from '../debt.service';
import { GridService } from '../../../../../components/grid/grid.service';
import { LookupService } from '../../../../../../core/lookup/lookup.service';
import { MessageBusService } from '../../../../../../core/message-bus/message-bus.service';
import { UserDictionariesService } from '../../../../../../core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '../../../../../../core/user/permissions/user-permissions.service';

@Component({
  selector: 'app-debt-grid',
  templateUrl: './debt-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DebtGridComponent {
  private selectedDebt$ = new BehaviorSubject<IDebt>(null);

  toolbarItems: Array<IToolbarItem> = [
    {
      type: ToolbarItemTypeEnum.BUTTON_ADD,
      enabled: this.canAdd$,
      action: () => this.onAdd()
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_EDIT,
      enabled: Observable.combineLatest(this.canEdit$, this.selectedDebt$).map(([ canEdit, debt ]) => canEdit && !!debt),
      action: () => this.onEdit(this.selectedDebt$.value.id)
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_REFRESH,
      action: () => this.fetch()
    },
  ];

  columns: Array<IGridColumn> = [
    { prop: 'id' },
    { prop: 'creditTypeCode' },
    { prop: 'creditName' },
    { prop: 'contract' },
    { prop: 'statusCode' },
    { prop: 'creditStartDate' },
    { prop: 'currencyId' },
    { prop: 'debtSum' },
    { prop: 'totalSum' },
    { prop: 'dpd' },
    { prop: 'portfolioId' },
    { prop: 'bankId' },
    { prop: 'debtReasonCode' },
  ];

  debts: Array<IDebt> = [];

  private personId = (this.route.params as any).value.id || null;

  private gridSubscription: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private debtService: DebtService,
    private gridService: GridService,
    private lookupService: LookupService,
    private messageBusService: MessageBusService,
    private route: ActivatedRoute,
    private router: Router,
    private userDictionariesService: UserDictionariesService,
    private userPermissionsService: UserPermissionsService,
  ) {
    this.gridSubscription = Observable.combineLatest(
      this.userDictionariesService.getDictionariesAsOptions([
        UserDictionariesService.DICTIONARY_PRODUCT_TYPE,
        UserDictionariesService.DICTIONARY_DEBT_STATUS,
        UserDictionariesService.DICTIONARY_DEBT_ORIGINATION_REASON,
      ]),
      this.lookupService.currencyOptions,
      this.lookupService.portfolioOptions,
      this.lookupService.contractorOptions,
    )
    .take(1)
    .subscribe(([ dictionariesOptions, currencyOptions, portfolioOptions, contractorOptions ]) => {
      const renderers: IRenderer = {
        creditStartDate: 'dateRenderer',
        creditTypeCode: [ ...dictionariesOptions[UserDictionariesService.DICTIONARY_PRODUCT_TYPE] ],
        statusCode: [ ...dictionariesOptions[UserDictionariesService.DICTIONARY_DEBT_STATUS] ],
        debtReasonCode: [ ...dictionariesOptions[UserDictionariesService.DICTIONARY_DEBT_ORIGINATION_REASON] ],
        currencyId: [ ...currencyOptions ],
        portfolioId: [ ...portfolioOptions ],
        bankId: [ ...contractorOptions ],
      }
      this.columns = this.gridService.setRenderers(this.columns, renderers);
      this.cdRef.markForCheck();
    });

    this.fetch();
  }

  onDoubleClick(debt: IDebt): void {
    this.onEdit(debt.id);
  }

  onSelect(debt: IDebt): void {
    this.selectedDebt$.next(debt);
    this.messageBusService.dispatch(DebtService.MESSAGE_DEBT_SELECTED, null, debt);
  }

  private onAdd(): void {
    this.router.navigate([ `${this.router.url}/debt/create` ]);
  }

  private onEdit(debtId: number): void {
    this.router.navigate([ `${this.router.url}/debt/${debtId}` ]);
  }

  get canAdd$(): Observable<boolean> {
    return this.userPermissionsService
      .hasOne([
        'DEBT_ADD',
        // TODO(d.maltsev): DEBT_DICTX_EDIT_LIST are not necesserily boolean values
        'DEBT_DICT1_EDIT_LIST',
        'DEBT_DICT2_EDIT_LIST',
        'DEBT_DICT3_EDIT_LIST',
        'DEBT_DICT4_EDIT_LIST'
      ])
      .distinctUntilChanged();
  }

  get canEdit$(): Observable<boolean> {
    return this.userPermissionsService
      .hasOne([
        'DEBT_EDIT',
        'DEBT_PORTFOLIO_EDIT',
        'DEBT_COMPONENT_SUM_EDIT',
        // TODO(d.maltsev): DEBT_DICTX_EDIT_LIST are not necesserily boolean values
        'DEBT_DICT1_EDIT_LIST',
        'DEBT_DICT2_EDIT_LIST',
        'DEBT_DICT3_EDIT_LIST',
        'DEBT_DICT4_EDIT_LIST'
      ])
      .distinctUntilChanged();
  }

  private fetch(): void {
    this.debtService.fetchAll(this.personId).subscribe(debts => {
      this.onSelect({ id: null } as IDebt);
      this.debts = debts;
      this.cdRef.markForCheck();
    });
  }
}
