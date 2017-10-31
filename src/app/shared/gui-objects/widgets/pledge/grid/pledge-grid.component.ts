import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { IPledgeContract } from '../pledge.interface';
import { IGridColumn } from '../../../../../shared/components/grid/grid.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '../../../../../shared/components/toolbar-2/toolbar-2.interface';

import { PledgeService } from '../pledge.service';
import { GridService } from '../../../../components/grid/grid.service';
import { NotificationsService } from '../../../../../core/notifications/notifications.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';

@Component({
  selector: 'app-pledge-grid',
  templateUrl: './pledge-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PledgeGridComponent implements OnInit, OnDestroy {

  private selectedContract$ = new BehaviorSubject<IPledgeContract>(null);

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
  ];

  private _contracts: Array<IPledgeContract> = [];

  private debtId = (this.route.params as any).value.debtId || null;

  private viewPermissionSubscription: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private pledgeService: PledgeService,
    private gridService: GridService,
    private notificationsService: NotificationsService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.gridService.setAllRenderers(this.columns)
    .take(1)
    .subscribe(columns => {
      this.columns = [ ...columns ];
      this.cdRef.markForCheck();
    });

    this.viewPermissionSubscription = this.pledgeService.canView$.subscribe(hasViewPermission => {
      if (hasViewPermission) {
        this.fetch();
      } else {
        this.clear();
        this.notificationsService.error('errors.default.read.403').entity('entities.pledgeContract.gen.plural').dispatch();
      }
    });
  }

  ngOnDestroy(): void {
    this.viewPermissionSubscription.unsubscribe();
  }

  get contracts(): Array<IPledgeContract> {
    return this._contracts;
  }

  onSelect(pledge: IPledgeContract): void {
    this.selectedContract$.next(pledge);
  }

  private onAdd(): void {
    this.router.navigate([ `${this.router.url}/pledge/create` ]);
  }

  private fetch(): void {
    this.pledgeService.fetchAll(this.debtId).subscribe(contracts => {
      this._contracts = contracts;
      this.cdRef.markForCheck();
    });
  }

  private clear(): void {
    this._contracts = [];
    this.cdRef.markForCheck();
  }
}
