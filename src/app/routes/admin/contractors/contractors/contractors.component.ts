import { ChangeDetectionStrategy, Component, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Actions } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { IContractor } from '../contractors-and-portfolios.interface';
import { IGridColumn } from '../../../../shared/components/grid/grid.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '../../../../shared/components/toolbar-2/toolbar-2.interface';

import { ContractorsAndPortfoliosService } from '../contractors-and-portfolios.service';
import { GridService } from '../../../../shared/components/grid/grid.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';
import { UserDictionariesService } from '../../../../core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '../../../../core/user/permissions/user-permissions.service';

import { DialogFunctions } from '../../../../core/dialog';

@Component({
  selector: 'app-contractors',
  templateUrl: './contractors.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContractorsComponent extends DialogFunctions implements OnDestroy {
  toolbarItems: Array<IToolbarItem> = [
    {
      type: ToolbarItemTypeEnum.BUTTON_ADD,
      action: () => this.onAdd(),
      enabled: this.canAdd$
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_EDIT,
      action: () => this.onEdit(),
      enabled: Observable.combineLatest(
        this.canEdit$,
        this.contractorsAndPortfoliosService.selectedContractorId$
      ).map(([hasPermissions, selectedContractor]) => hasPermissions && !!selectedContractor)
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_DELETE,
      action: () => this.setDialog('delete'),
      enabled: Observable.combineLatest(
        this.canDelete$,
        this.contractorsAndPortfoliosService.selectedContractorId$
      ).map(([hasPermissions, selectedContractorId]) => hasPermissions && !!selectedContractorId)
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_REFRESH,
      action: () => this.contractorsAndPortfoliosService.readAllContractors(),
      enabled: this.canView$
    }
  ];

  columns: Array<IGridColumn> = [
    { prop: 'id', minWidth: 50, maxWidth: 50 },
    { prop: 'name', minWidth: 120, maxWidth: 200 },
    { prop: 'fullName', minWidth: 120, maxWidth: 200 },
    { prop: 'smsName', minWidth: 120, maxWidth: 200 },
    { prop: 'responsibleName', minWidth: 100, maxWidth: 150 },
    { prop: 'typeCode', minWidth: 100, maxWidth: 150, dictCode: UserDictionariesService.DICTIONARY_CONTRACTOR_TYPE },
    { prop: 'phone', minWidth: 100, maxWidth: 150 },
    { prop: 'address', minWidth: 100, maxWidth: 250 },
    { prop: 'comment', minWidth: 100, maxWidth: 250 },
  ];

  dialog: string;
  selectedContractor: IContractor;
  needToReadAllContractors$ = new BehaviorSubject<string>(null);
  private _contractors: IContractor[];


  private actionsSubscription: Subscription;
  private canViewSubscription: Subscription;
  private contractorsSubscription: Subscription;

  constructor(
    private actions: Actions,
    private contractorsAndPortfoliosService: ContractorsAndPortfoliosService,
    private gridService: GridService,
    private cdRef: ChangeDetectorRef,
    private notificationsService: NotificationsService,
    private router: Router,
    private userPermissionsService: UserPermissionsService,
  ) {
    super();
    this.gridService.setDictionaryRenderers(this.columns)
      .take(1)
      .subscribe(columns => {
        this.columns = this.gridService.setRenderers(columns);
      });

    this.canViewSubscription = this.canView$.subscribe(canView => {
      if (canView) {
        this.needToReadAllContractors$
          .flatMap(() => this.contractorsAndPortfoliosService.readAllContractors())
          .subscribe((contractors: IContractor[]) => {
            this.contractors = contractors;
          });
        this.needToReadAllContractors$.next('');
      } else {
        this.clearContractors();
        this.notificationsService.error('errors.default.read.403').entity('entities.contractors.gen.plural').dispatch();
      }
    });

    this.contractorsSubscription = this.contractorsAndPortfoliosService.selectedContractorId$.subscribe(contractorId => {
      this.selectedContractor = this.contractors && this.contractors.find((contractor) => contractor.id === contractorId) || null;
    });

    this.actionsSubscription = this.actions
      .ofType(ContractorsAndPortfoliosService.CONTRACTOR_DELETE_SUCCESS)
      .subscribe(() => this.setDialog());
  }

  set contractors(newContractors: IContractor[]) {
    this._contractors = newContractors;
    this.cdRef.markForCheck();
  }

  get contractors(): IContractor[] {
    return this._contractors;
  }

  ngOnDestroy(): void {
    this.actionsSubscription.unsubscribe();
    this.canViewSubscription.unsubscribe();
    this.contractorsSubscription.unsubscribe();
    this.needToReadAllContractors$.unsubscribe();
    this.clearContractors();
  }

  // get contractors$(): Observable<IContractor[]> {
  //   return this.contractorsAndPortfoliosService.contractors$;
  // }

  clearContractors(): void {
    this.contractors = [];
  }


  get canView$(): Observable<boolean> {
    return this.userPermissionsService.has('CONTRACTOR_VIEW');
  }

  get canAdd$(): Observable<boolean> {
    return this.userPermissionsService.has('CONTRACTOR_ADD');
  }

  get canEdit$(): Observable<boolean> {
    return this.userPermissionsService.has('CONTRACTOR_EDIT');
  }

  get canDelete$(): Observable<boolean> {
    return this.userPermissionsService.has('CONTRACTOR_DELETE');
  }

  onAdd(): void {
    this.router.navigate([ `/admin/contractors/create` ]);
  }

  onEdit(): void {
    this.router.navigate([ `/admin/contractors/${this.selectedContractor.id}` ]);
  }

  onSelect(contractor: IContractor): void {
    this.contractorsAndPortfoliosService.selectContractor(contractor.id);
  }

  onRemoveSubmit(): void {
    console.log(this.selectedContractor.id);
    this.contractorsAndPortfoliosService.deleteContractor(this.selectedContractor.id)
      .do(() => {
        this.setDialog();
        this.needToReadAllContractors$.next('');
      })
      .subscribe();
  }

}
