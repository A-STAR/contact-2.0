import { ChangeDetectionStrategy, Component, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { first } from 'rxjs/operators';

import { IContractor } from '../contractors-and-portfolios.interface';
import { IGridColumn } from '../../../../shared/components/grid/grid.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '../../../../shared/components/toolbar-2/toolbar-2.interface';

import { ContractorsAndPortfoliosService } from '../contractors-and-portfolios.service';
import { GridService } from '../../../../shared/components/grid/grid.service';
import { MessageBusService } from '../../../../core/message-bus/message-bus.service';
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
export class ContractorsComponent extends DialogFunctions implements OnDestroy {
  lastManagerLessContractorId$ = new BehaviorSubject<number>(null);

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
    { prop: 'responsibleName', minWidth: 100, maxWidth: 150 },
    { prop: 'typeCode', minWidth: 100, maxWidth: 150, dictCode: UserDictionariesService.DICTIONARY_CONTRACTOR_TYPE },
    { prop: 'phone', minWidth: 100, maxWidth: 150 },
    { prop: 'address', minWidth: 100, maxWidth: 250 },
    { prop: 'comment', minWidth: 100 },
  ];

  dialog: string;
  selectedContractor: IContractor[] = [];
  selection: IContractor[] ;
  private _contractors: IContractor[];

  private canViewSubscription: Subscription;
  private contractorsSubscription: Subscription;
  private viewSubFromChildCreate: Subscription;

  constructor(
    private contractorsAndPortfoliosService: ContractorsAndPortfoliosService,
    private messageBusService: MessageBusService,
    private gridService: GridService,
    private cdRef: ChangeDetectorRef,
    private notificationsService: NotificationsService,
    private router: Router,
    private userPermissionsService: UserPermissionsService,
  ) {
    super();
    this.gridService.setDictionaryRenderers(this.columns)
      .pipe(first())
      .subscribe(columns => {
        this.columns = this.gridService.setRenderers(columns);
      });

    this.canViewSubscription = this.canView$.subscribe(canView => {
      if (canView) {
        this.fetchContractors();
      } else {
        this.clearContractors();
        this.notificationsService.error('errors.default.read.403').entity('entities.contractors.gen.plural').dispatch();
      }
    });

    this.contractorsSubscription = this.contractorsAndPortfoliosService.selectedContractorId$.subscribe(contractorId => {
      this.selectedContractor = this.contractors && this.contractors.find((contractor) => contractor.id === contractorId)
        ? [this.contractors.find((contractor) => contractor.id === contractorId)]
        : [];
    });

    this.viewSubFromChildCreate = this.messageBusService
      .select(ContractorsAndPortfoliosService.CONTRACTOR_FETCH)
      .subscribe(() => this.fetchContractors());

    this.viewSubFromChildCreate = this.messageBusService
      .select(ContractorsAndPortfoliosService.EMPTY_MANAGERS_FOR_CONTRACTOR_DETECTED)
      .subscribe(managerLessContractorId  => this.lastManagerLessContractorId$.next(managerLessContractorId as number));
  }

  set contractors(newContractors: IContractor[]) {
    this._contractors = newContractors;
    if (this.selectedContractor) {
      this.onSelect(this.selectedContractor[0]);
      this.contractorsAndPortfoliosService.state
          .map(state => state.selectedContractorId)
          .pipe(first())
          .subscribe(contractorId => {
            this.selectedContractor = this.contractors && this.contractors.find((contractor) => contractor.id === contractorId)
              ? [this.contractors.find((contractor) => contractor.id === contractorId)]
              : [];
          });
          this.cdRef.markForCheck();
    }
  }

  get contractors(): IContractor[] {
    return this._contractors;
  }

  ngOnDestroy(): void {
    this.lastManagerLessContractorId$.unsubscribe();
    this.canViewSubscription.unsubscribe();
    this.viewSubFromChildCreate.unsubscribe();
    this.contractorsSubscription.unsubscribe();
    this.clearContractors();
  }

  clearContractors(): void {
    this.contractorsAndPortfoliosService.selectContractor(null);
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
    this.router.navigate([ `/admin/contractors/${this.selectedContractor[0].id}` ]);
  }

  onSelect(contractor: IContractor): void {
    this.contractorsAndPortfoliosService.selectContractor(contractor && contractor.id || null);
  }

  onRemoveSubmit(): void {
    this.contractorsAndPortfoliosService.deleteContractor(this.selectedContractor[0].id)
      .subscribe(() => {
        this.setDialog();
        this.fetchContractors();
      });
  }

  private fetchContractors(): void {
    this.contractorsAndPortfoliosService.readAllContractors()
      .subscribe((contractors: IContractor[]) => {
        this.contractors = contractors;
      });
  }
}
