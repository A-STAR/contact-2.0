import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';
import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Actions } from '@ngrx/effects';

import { IGuaranteeContract } from '../guarantee.interface';
import { IGridColumn } from '../../../../../shared/components/grid/grid.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '../../../../../shared/components/toolbar-2/toolbar-2.interface';

import { GuaranteeService } from '../guarantee.service';
import { GridService } from '../../../../components/grid/grid.service';
import { NotificationsService } from '../../../../../core/notifications/notifications.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '../../../../../core/user/permissions/user-permissions.service';

@Component({
  selector: 'app-guarantee-grid',
  templateUrl: './guarantee-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GuaranteeGridComponent implements OnInit, OnDestroy {

  private selectedContract$ = new BehaviorSubject<IGuaranteeContract>(null);

  toolbarItems: Array<IToolbarItem> = [
    {
      type: ToolbarItemTypeEnum.BUTTON_ADD,
      enabled: this.canAdd$,
      action: () => this.onAdd()
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_EDIT,
      action: () => this.onEdit(this.selectedContract$.value.id),
      enabled: Observable.combineLatest(
        this.canEdit$,
        this.selectedContract$
      ).map(([canEdit, selectedContract]) => !!canEdit && !!selectedContract)
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_DELETE,
      action: () => this.setDialog('removeGuarantee'),
      enabled: Observable.combineLatest(
        this.canDelete$,
        this.selectedContract$
      ).map(([canDelete, selectedContract]) => !!canDelete && !!selectedContract),
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

  private dialog: string;
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
    private notificationsService: NotificationsService,
    private route: ActivatedRoute,
    private router: Router,
    private userPermissionsService: UserPermissionsService,
  ) {
    this.gridService.setAllRenderers(this.columns)
      .take(1)
      .subscribe(columns => {
        this.columns = [...columns];
        this.cdRef.markForCheck();
      });
  }

  ngOnInit(): void {
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

  onDoubleClick(contract: IGuaranteeContract): void {
    this.onEdit(contract.id);
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

  isDialog(dialog: string): boolean {
    return this.dialog === dialog;
  }

  setDialog(dialog: string): void {
    this.dialog = dialog;
  }

  onCancel(): void {
    this.setDialog(null);
  }

  private onAdd(): void {
    this.router.navigate([ `${this.router.url}/guaranteeContract/create` ]);
  }

  private onEdit(contractId: number): void {
    this.router.navigate([ `${this.router.url}/guaranteeContract/${contractId}` ]);
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
