import { ChangeDetectorRef, ChangeDetectionStrategy, Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { first } from 'rxjs/operators';
import { Actions } from '@ngrx/effects';

import { IContractor } from '../contractors-and-portfolios.interface';
import { IGridColumn } from '../../../../shared/components/grid/grid.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '../../../../shared/components/toolbar-2/toolbar-2.interface';

import { ContractorsAndPortfoliosService } from '../contractors-and-portfolios.service';
import { GridService } from '../../../../shared/components/grid/grid.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';
import { UserDictionariesService } from '../../../../core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '../../../../core/user/permissions/user-permissions.service';

import { DialogFunctions } from '../../../../core/dialog';
import { combineLatestAnd } from '../../../../core/utils/helpers';

@Component({
  selector: 'app-contractors',
  templateUrl: './contractors.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContractorsComponent extends DialogFunctions implements OnInit, OnDestroy {

  toolbarItems: Array<IToolbarItem> = [
    {
      type: ToolbarItemTypeEnum.BUTTON_ADD,
      action: () => this.onAdd(),
      enabled: this.canAdd$
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_EDIT,
      action: () => this.onEdit(),
      enabled: combineLatestAnd([
        this.canEdit$,
        this.contractorsAndPortfoliosService.selectedContractorId$.map(o => !!o)
      ])
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_DELETE,
      action: () => this.setDialog('delete'),
      enabled: combineLatestAnd([
        this.canDelete$,
        this.contractorsAndPortfoliosService.selectedContractorId$.map(o => !!o),
      ])
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_REFRESH,
      action: () => this.fetchContractors(),
      enabled: this.canView$
    }
  ];

  columns: Array<IGridColumn> = [
    { prop: 'id', minWidth: 50, maxWidth: 50 },
    { prop: 'name', minWidth: 120, maxWidth: 200 },
    { prop: 'fullName', minWidth: 120, maxWidth: 200 },
    { prop: 'smsName', minWidth: 120, maxWidth: 200 },
    { prop: 'responsibleFullName', minWidth: 100, maxWidth: 150 },
    { prop: 'typeCode', minWidth: 100, maxWidth: 150, dictCode: UserDictionariesService.DICTIONARY_CONTRACTOR_TYPE },
    { prop: 'phone', minWidth: 100, maxWidth: 150 },
    { prop: 'address', minWidth: 100, maxWidth: 250 },
    { prop: 'comment', minWidth: 100 },
  ];

  contractors: IContractor[] = [];
  dialog: string;
  selection: IContractor[] = [];

  private actionsSub: Subscription;
  private canViewSubscription: Subscription;
  private contractorsSubscription: Subscription;

  constructor(
    private actions$: Actions,
    private contractorsAndPortfoliosService: ContractorsAndPortfoliosService,
    private gridService: GridService,
    private cdRef: ChangeDetectorRef,
    private notificationsService: NotificationsService,
    private router: Router,
    private userPermissionsService: UserPermissionsService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.gridService.setAllRenderers(this.columns)
      .pipe(first())
      .subscribe(columns => {
        this.columns = [...columns];
      });

    this.canViewSubscription = this.canView$.subscribe(canView => {
      if (canView) {
        this.fetchContractors();
      } else {
        this.clearContractors();
        this.notificationsService.error('errors.default.read.403').entity('entities.contractors.gen.plural').dispatch();
      }
    });

    this.contractorsSubscription = this.contractorsAndPortfoliosService.selectedContractorId$
      .subscribe(contractorId => {
        const found = this.contractors.find(contractor => contractor.id === contractorId);
        this.selection = found ? [found] : [];
      });

    this.actionsSub = this.actions$.subscribe(action => {
      if (action.type === ContractorsAndPortfoliosService.CONTRACTOR_CREATE) {
        this.fetchContractors();
      }
    });
  }

  ngOnDestroy(): void {
    this.actionsSub.unsubscribe();
    this.canViewSubscription.unsubscribe();
    this.contractorsSubscription.unsubscribe();
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
    this.router.navigate([ `/admin/contractors/${this.selection[0].id}` ]);
  }

  onSelect(contractor: IContractor): void {
    this.contractorsAndPortfoliosService.selectContractor(contractor && contractor.id || null);
  }

  onRemove(): void {
    this.contractorsAndPortfoliosService.deleteContractor(this.selection[0].id)
      .subscribe(() => {
        this.setDialog();
        this.fetchContractors();
      });
  }

  private fetchContractors(): void {
    this.contractorsAndPortfoliosService.readAllContractors()
      .subscribe(contractors => {
        this.contractors = contractors;
        if (this.selection.length) {
          // this.onSelect(this.selectedContractor);
          this.contractorsAndPortfoliosService.state
            .map(state => state.selectedContractorId)
            .pipe(first())
            .subscribe(contractorId => {
              const found = this.contractors.find(contractor => contractor.id === contractorId);
              this.selection = found ? [found] : [];
            });
        }
        this.cdRef.markForCheck();
      });
  }

  private clearContractors(): void {
    this.contractorsAndPortfoliosService.selectContractor(null);
  }
}
