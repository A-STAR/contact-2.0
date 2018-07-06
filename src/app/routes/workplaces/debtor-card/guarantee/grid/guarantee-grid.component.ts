import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';

import { IGuaranteeContract } from '@app/routes/workplaces/core/guarantee/guarantee.interface';
import { ISimpleGridColumn } from '@app/shared/components/grids/grid/grid.interface';
import { IToolbarItem, ToolbarItemType } from '@app/shared/components/toolbar-2/toolbar-2.interface';

import { GuaranteeService } from '@app/routes/workplaces/core/guarantee/guarantee.service';
import { RoutingService } from '@app/core/routing/routing.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

import { DateRendererComponent } from '@app/shared/components/grids/renderers/date/date.component';
import { DialogFunctions } from '@app/core/dialog';

import { addGridLabel, isEmpty, combineLatestAnd } from '@app/core/utils';

@Component({
  selector: 'app-guarantee-grid',
  templateUrl: './guarantee-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GuaranteeGridComponent extends DialogFunctions implements OnInit, OnDestroy {

  private selectedContract$ = new BehaviorSubject<IGuaranteeContract>(null);

  toolbarItems: IToolbarItem[] = [
    {
      type: ToolbarItemType.BUTTON,
      buttonType: ButtonType.ADD,
      enabled: this.canAdd$,
      action: () => this.onAdd()
    },
    {
      type: ToolbarItemType.BUTTON,
      buttonType: ButtonType.EDIT,
      action: () => this.onEdit(),
      enabled: combineLatestAnd([
        this.canEdit$,
        this.selectedContract$.map(selectedContract => !!selectedContract)
      ])
    },
    {
      type: ToolbarItemType.BUTTON,
      buttonType: ButtonType.ADD_USER,
      action: () => this.onAddGuarantor(),
      label: 'widgets.guaranteeContract.toolbar.add',
      enabled: combineLatestAnd([
        this.canEdit$,
        this.selectedContract$.map(selectedContract => !!selectedContract)
      ])
    },
    {
      type: ToolbarItemType.BUTTON,
      buttonType: ButtonType.DELETE,
      action: () => this.setDialog('removeGuarantee'),
      enabled: combineLatestAnd([
        this.canDelete$,
        this.selectedContract$.map(selectedContract => !!selectedContract)
      ])
    },
    {
      type: ToolbarItemType.BUTTON,
      buttonType: ButtonType.REFRESH,
      action: () => this.fetch(),
      enabled: this.canView$
    },
  ];

  columns: ISimpleGridColumn<IGuaranteeContract>[] = [
    { prop: 'id', width: 70, minWidth: 40 },
    { prop: 'contractNumber' },
    { prop: 'fullName' },
    { prop: 'typeCode', dictCode: UserDictionariesService.DICTIONARY_PERSON_TYPE },
    { prop: 'contractStartDate', maxWidth: 130, renderer: DateRendererComponent },
    { prop: 'contractEndDate', maxWidth: 130, renderer: DateRendererComponent },
    { prop: 'contractTypeCode', dictCode: UserDictionariesService.DICTIONARY_GUARANTOR_RESPONSIBILITY_TYPE },
    { prop: 'comment' },
  ].map(addGridLabel('widgets.guaranteeContract.grid'));

  contracts: Array<IGuaranteeContract> = [];
  dialog: string;

  private routeParams = (<any>this.route.params).value;
  private debtId = this.routeParams.debtId || null;

  private actionSubscription: Subscription;
  private canViewSubscription: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private guaranteeService: GuaranteeService,
    private route: ActivatedRoute,
    private routingService: RoutingService,
    private userPermissionsService: UserPermissionsService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.fetch();

    this.actionSubscription = this.guaranteeService
      .getAction(GuaranteeService.MESSAGE_GUARANTOR_SAVED)
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

  onSelect(contracts: IGuaranteeContract[]): void {
    const contract = isEmpty(contracts)
      ? null
      : contracts[0];
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
    this.routingService.navigate([ 'guarantee/create' ], this.route);
  }

  private onAddGuarantor(): void {
    const { contractId } = this.selectedContract$.value;
    this.routingService.navigate([ `guarantee/${contractId}/guarantor/create` ], this.route);
  }

  private onEdit(contract: IGuaranteeContract = null): void {
    const { contractId, personId } = contract || this.selectedContract$.value;
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
}
