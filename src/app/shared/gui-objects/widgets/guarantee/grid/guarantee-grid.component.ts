import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';

import { Actions } from '@ngrx/effects';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';

import { IGuaranteeContract } from '../guarantee.interface';
import { IGridColumn } from '../../../../../shared/components/grid/grid.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '../../../../../shared/components/toolbar-2/toolbar-2.interface';

import { GuaranteeService } from '../guarantee.service';
import { GridService } from '../../../../components/grid/grid.service';
import { MessageBusService } from '../../../../../core/message-bus/message-bus.service';
import { NotificationsService } from '../../../../../core/notifications/notifications.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '../../../../../core/user/permissions/user-permissions.service';

import { DialogFunctions } from '../../../../../core/dialog';
import { combineLatestAnd } from '../../../../../core/utils/helpers';

@Component({
  selector: 'app-guarantee-grid',
  templateUrl: './guarantee-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GuaranteeGridComponent extends DialogFunctions implements OnInit, OnDestroy {

  private selectedContract$ = new BehaviorSubject<IGuaranteeContract>(null);

  toolbarItems: Array<IToolbarItem> = [
    {
      type: ToolbarItemTypeEnum.BUTTON_ADD,
      enabled: this.canAdd$,
      action: () => this.onAdd()
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_EDIT,
      action: () => this.onEdit(this.selectedContract$.value),
      enabled: combineLatestAnd([
        this.canEdit$,
        this.selectedContract$.map(selectedContract => !!selectedContract)
      ])
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_DELETE,
      action: () => this.setDialog('removeGuarantee'),
      enabled: combineLatestAnd([
        this.canDelete$,
        this.selectedContract$.map(selectedContract => !!selectedContract)
      ])
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_REFRESH,
      action: () => this.fetch(),
      enabled: this.canView$
    },
  ];

  columns: Array<IGridColumn> = [
    { prop: 'id', width: 70, minWidth: 40 },
    { prop: 'contractNumber' },
    { prop: 'fullName' },
    { prop: 'typeCode', dictCode: UserDictionariesService.DICTIONARY_PERSON_TYPE },
    { prop: 'contractStartDate', maxWidth: 130, renderer: 'dateRenderer' },
    { prop: 'contractEndDate', maxWidth: 130, renderer: 'dateRenderer' },
    { prop: 'contractTypeCode', dictCode: UserDictionariesService.DICTIONARY_GUARANTOR_RESPONSIBILITY_TYPE },
    { prop: 'comment' },
  ];

  contracts: Array<IGuaranteeContract> = [];
  dialog: string;

  private routeParams = (<any>this.route.params).value;
  private debtId = this.routeParams.debtId || null;

  private actionSubscription: Subscription;
  private canViewSubscription: Subscription;

  gridStyles = this.routeParams.contactId ? { height: '230px' } : { height: '500px' };

  constructor(
    private actions: Actions,
    private cdRef: ChangeDetectorRef,
    private guaranteeService: GuaranteeService,
    private gridService: GridService,
    private messageBusService: MessageBusService,
    private notificationsService: NotificationsService,
    private route: ActivatedRoute,
    private router: Router,
    private userPermissionsService: UserPermissionsService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.gridService.setAllRenderers(this.columns)
      .take(1)
      .subscribe(columns => {
        this.columns = [...columns];
        this.cdRef.markForCheck();
      });

    this.canViewSubscription = this.canView$
      .subscribe(hasPermission => {
        if (hasPermission) {
          this.fetch();
        } else {
          this.notificationsService.error('errors.default.read.403').entity('entities.employment.gen.plural').dispatch();
          this.clear();
        }
      });

    this.actionSubscription = this.actions
      .ofType(GuaranteeService.MESSAGE_GUARANTEE_CONTRACT_SAVED)
      .subscribe(() => this.fetch());
  }

  ngOnDestroy(): void {
    this.selectedContract$.complete();
    this.actionSubscription.unsubscribe();
    this.canViewSubscription.unsubscribe();
  }

  get canView$(): Observable<boolean> {
    return this.userPermissionsService.has('GUARANTEE_VIEW');
  }

  get canAdd$(): Observable<boolean> {
    return this.userPermissionsService.has('GUARANTEE_ADD');
  }

  get canEdit$(): Observable<boolean> {
    return this.userPermissionsService.has('GUARANTEE_EDIT');
  }

  get canDelete$(): Observable<boolean> {
    return this.userPermissionsService.has('GUARANTEE_DELETE');
  }

  onDoubleClick(contract: IGuaranteeContract): void {
    this.onEdit(contract);
  }

  onSelect(contract: IGuaranteeContract): void {
    this.selectedContract$.next(contract);
  }

  onRemove(): void {
    const { id: contractId } = this.selectedContract$.value;
    this.guaranteeService.delete(this.debtId, contractId, this.selectedContract$.value.personId)
      .subscribe(() => {
        this.setDialog(null);
        this.fetch();
      });
  }

  onCancel(): void {
    this.setDialog(null);
  }

  private onAdd(): void {
    this.router.navigate([ `${this.router.url}/guaranteeContract/create` ]);
  }

  private onEdit(contract: IGuaranteeContract): void {
    this.messageBusService.passValue('contract', contract);
    this.router.navigate([ `${this.router.url}/guaranteeContract/view` ]);
  }

  private fetch(): void {
    this.guaranteeService.fetchAll(this.debtId)
      .subscribe(contracts => {
        this.contracts = contracts;
        this.selectedContract$.next(null);
        this.cdRef.markForCheck();
      });
  }

  private clear(): void {
    this.contracts = [];
    this.selectedContract$.next(null);
    this.cdRef.markForCheck();
  }

}
