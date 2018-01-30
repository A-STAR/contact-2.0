import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { first } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';

import { IGuaranteeContract } from '@app/shared/gui-objects/widgets/guarantee/guarantee.interface';
import { IGridColumn } from '@app/shared/components/grid/grid.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '@app/shared/components/toolbar-2/toolbar-2.interface';

import { GuaranteeService } from '@app/shared/gui-objects/widgets/guarantee/guarantee.service';
import { GridService } from '@app/shared/components/grid/grid.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';
import { RoutingService } from '@app/core/routing/routing.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

import { DialogFunctions } from '@app/core/dialog';
import { combineLatestAnd } from '@app/core/utils/helpers';

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
      action: () => this.onEdit(),
      enabled: combineLatestAnd([
        this.canEdit$,
        this.selectedContract$.map(selectedContract => !!selectedContract)
      ])
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_ADD_USER,
      action: () => this.onAddGuarantor(),
      label: 'widgets.guaranteeContract.toolbar.add',
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
    private cdRef: ChangeDetectorRef,
    private guaranteeService: GuaranteeService,
    private gridService: GridService,
    private notificationsService: NotificationsService,
    private route: ActivatedRoute,
    private routingService: RoutingService,
    private userPermissionsService: UserPermissionsService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.gridService.setAllRenderers(this.columns)
      .pipe(first())
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

    this.actionSubscription = this.guaranteeService
      .getAction(GuaranteeService.MESSAGE_GUARANTEE_CONTRACT_SAVED)
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

  onDoubleClick(): void {
    this.onEdit();
  }

  onSelect(contract: IGuaranteeContract): void {
    this.selectedContract$.next(contract);
  }

  onRemove(): void {
    const { contractId, personId } = this.selectedContract$.value;
    this.guaranteeService.delete(this.debtId, contractId, personId)
      .subscribe(() => {
        this.setDialog(null);
        this.fetch();
      });
  }

  onCancel(): void {
    this.setDialog(null);
  }

  private onAdd(): void {
    this.routingService.navigate([ 'guarantee', 'create' ], this.route);
  }

  private onAddGuarantor(): void {
    const { contractId } = this.selectedContract$.value;
    this.routingService.navigate([ `guarantee/${contractId}/guarantor/add` ], this.route);
  }

  private onEdit(): void {
    const { contractId, personId } = this.selectedContract$.value;
    this.routingService.navigate([ `guarantee/${contractId}/guarantor/${personId}` ], this.route);
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
