import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { IPledgeContract } from '@app/routes/workplaces/core/pledge/pledge.interface';
import { ISimpleGridColumn } from '@app/shared/components/grids/grid/grid.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '@app/shared/components/toolbar-2/toolbar-2.interface';

import { NotificationsService } from '@app/core/notifications/notifications.service';
import { PledgeService } from '@app/routes/workplaces/core/pledge/pledge.service';
import { RoutingService } from '@app/core/routing/routing.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';

import { DialogFunctions } from '@app/core/dialog';
import { DateRendererComponent } from '@app/shared/components/grids/renderers/date/date.component';

import { addGridLabel, combineLatestAnd, isEmpty } from '@app/core/utils';

@Component({
  selector: 'app-pledge-grid',
  templateUrl: './pledge-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PledgeGridComponent extends DialogFunctions implements OnInit, OnDestroy {

  private selectedContract$ = new BehaviorSubject<IPledgeContract>(null);

  dialog: string;

  columns: ISimpleGridColumn<IPledgeContract>[] = [
    { prop: 'id' },
    { prop: 'contractNumber' },
    { prop: 'fullName' },
    { prop: 'typeCode', dictCode: UserDictionariesService.DICTIONARY_PERSON_TYPE },
    { prop: 'contractStartDate', renderer: DateRendererComponent },
    { prop: 'contractEndDate', renderer: DateRendererComponent },
    { prop: 'comment' },
    { prop: 'propertyType', dictCode: UserDictionariesService.DICTIONARY_PROPERTY_TYPE },
    { prop: 'propertyName' }
  ].map(addGridLabel('widgets.pledgeContract.grid'));

  toolbarItems: IToolbarItem[] = [
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
      type: ToolbarItemTypeEnum.BUTTON_ADD_USER,
      action: () => this.onAddProperty(this.selectedContract$.value),
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

  private _contracts: IPledgeContract[] = [];

  private debtId = (this.route.params as any).value.debtId || null;

  private viewPermissionSubscription: Subscription;
  private actionSubscription: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private notificationsService: NotificationsService,
    private pledgeService: PledgeService,
    private route: ActivatedRoute,
    private routingService: RoutingService
  ) {
    super();
  }

  ngOnInit(): void {
    this.viewPermissionSubscription = this.pledgeService.canView$
      .subscribe(canView => {
        if (canView) {
          this.fetch();
        } else {
          this.clear();
          this.notificationsService.permissionError().entity('entities.pledgeContract.gen.plural').dispatch();
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

  onSelect(pledges: IPledgeContract[]): void {
    const pledge = isEmpty(pledges)
      ? null
      : pledges[0];
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
    this.routingService.navigate([ 'pledge/create' ], this.route);
  }

  private onAddPledgor(contract: IPledgeContract): void {
    const { contractId } = contract;
    this.routingService.navigate([ `pledge/${contractId}/pledgor/create` ], this.route);
  }

  private onAddProperty(contract: IPledgeContract): void {
    const { contractId } = contract;
    this.routingService.navigate([ `pledge/${contractId}/property/create` ], this.route);
  }

  private onEdit(contract: IPledgeContract): void {
    const { contractId } = contract;
    this.routingService.navigate([ `pledge/${contractId}/edit` ], this.route);
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
