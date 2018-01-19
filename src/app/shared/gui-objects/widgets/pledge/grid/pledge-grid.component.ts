import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { first } from 'rxjs/operators';

import { IPledgeContract } from '../pledge.interface';
import { IGridColumn } from '../../../../../shared/components/grid/grid.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '../../../../../shared/components/toolbar-2/toolbar-2.interface';

import { PledgeService } from '../pledge.service';
import { GridService } from '../../../../components/grid/grid.service';
import { NotificationsService } from '../../../../../core/notifications/notifications.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';

import { DialogFunctions } from '../../../../../core/dialog';
import { combineLatestAnd } from '../../../../../core/utils/helpers';

@Component({
  selector: 'app-pledge-grid',
  templateUrl: './pledge-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PledgeGridComponent extends DialogFunctions implements OnInit, OnDestroy {

  private selectedContract$ = new BehaviorSubject<IPledgeContract>(null);

  dialog: string;

  columns: Array<IGridColumn> = [
    { prop: 'id' },
    { prop: 'contractNumber' },
    { prop: 'fullName' },
    { prop: 'typeCode', dictCode: UserDictionariesService.DICTIONARY_PERSON_TYPE },
    { prop: 'contractStartDate', renderer: 'dateRenderer' },
    { prop: 'contractEndDate', renderer: 'dateRenderer' },
    { prop: 'comment' },
    { prop: 'propertyType', dictCode: UserDictionariesService.DICTIONARY_PROPERTY_TYPE },
    { prop: 'propertyName' }
  ];

  toolbarItems: Array<IToolbarItem> = [
    {
      type: ToolbarItemTypeEnum.BUTTON_ADD,
      enabled: this.pledgeService.canAdd$,
      action: () => this.onAdd()
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_EDIT,
      enabled: combineLatestAnd([
        this.pledgeService.canEdit$,
        this.selectedContract$.map(selectedContract => !!selectedContract)
      ]),
      action: () => this.onEdit(this.selectedContract$.value)
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_ADD_USER,
      action: () => this.onAddPledgor(this.selectedContract$.value),
      label: 'widgets.pledgeContract.toolbar.add',
      enabled: combineLatestAnd([
        this.pledgeService.canEdit$,
        this.selectedContract$.map(selectedContract => !!selectedContract)
      ])
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_DELETE,
      action: () => this.setDialog('removePledge'),
      enabled: combineLatestAnd([
        this.pledgeService.canDelete$,
        this.selectedContract$.map(selectedContract => !!selectedContract)
      ])
    },
  ];

  private _contracts: Array<IPledgeContract> = [];

  private debtId = (this.route.params as any).value.debtId || null;

  private viewPermissionSubscription: Subscription;
  private actionSubscription: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private pledgeService: PledgeService,
    private gridService: GridService,
    private notificationsService: NotificationsService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    super();
  }

  ngOnInit(): void {
    this.gridService.setAllRenderers(this.columns)
    .pipe(first())
    .subscribe(columns => {
      this.columns = [ ...columns ];
      this.cdRef.markForCheck();
    });

    this.viewPermissionSubscription = this.pledgeService.canView$
      .subscribe(canView => {
        if (canView) {
          this.fetch();
        } else {
          this.clear();
          this.notificationsService.error('errors.default.read.403').entity('entities.pledgeContract.gen.plural').dispatch();
        }
      });

    this.actionSubscription = this.pledgeService
      .getAction(PledgeService.MESSAGE_PLEDGE_CONTRACT_SAVED)
      .subscribe(() => this.fetch());

    this.selectedContract$.subscribe(
      pledge => this.pledgeService.dispatchAction(PledgeService.MESSAGE_PLEDGE_CONTRACT_SELECTION_CHANGED, pledge)
    );
  }

  ngOnDestroy(): void {
    this.viewPermissionSubscription.unsubscribe();
    this.actionSubscription.unsubscribe();
  }

  get contracts(): Array<IPledgeContract> {
    return this._contracts;
  }

  onSelect(pledge: IPledgeContract): void {
    this.selectedContract$.next(pledge);
  }

  onDoubleClick(contract: IPledgeContract): void {
    this.onEdit(contract);
  }

  onRemove(): void {
    const { contractId, personId, propertyId } = this.selectedContract$.value;
    this.pledgeService.delete(this.debtId, contractId, personId, propertyId)
      .subscribe(() => {
        this.setDialog(null);
        this.fetch();
      });
  }

  onCancel(): void {
    this.setDialog(null);
  }

  private onAdd(): void {
    this.router.navigate([ `${this.router.url}/pledge/create` ]);
  }

  private onAddPledgor(contract: IPledgeContract): void {
    const { contractId } = contract;
    this.router.navigate([ `${this.router.url}/pledge/${contractId}/pledgor/add` ]);
  }

  private onEdit(contract: IPledgeContract): void {
    const { contractId, personId, propertyId } = contract;
    this.router.navigate([ `${this.router.url}/pledge/${contractId}/pledgor/${personId}/${propertyId}` ]);
  }

  private fetch(): void {
    this.pledgeService.fetchAll(this.debtId).subscribe(contracts => {
      this._contracts = contracts;
      this.selectedContract$.next(null);
      this.cdRef.markForCheck();
    });
  }

  private clear(): void {
    this._contracts = [];
    this.selectedContract$.next(null);
    this.cdRef.markForCheck();
  }
}
