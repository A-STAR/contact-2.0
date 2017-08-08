import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { IContractor } from '../contractors-and-portfolios.interface';
import { IGridColumn, IRenderer } from '../../../../shared/components/grid/grid.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '../../../../shared/components/toolbar-2/toolbar-2.interface';
import { ContractorActionEnum } from './contractors.interface';

import { ContentTabService } from '../../../../shared/components/content-tabstrip/tab/content-tab.service';
import { ContractorsAndPortfoliosService } from '../contractors-and-portfolios.service';
import { GridService } from '../../../../shared/components/grid/grid.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';
import { UserDictionariesService } from '../../../../core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '../../../../core/user/permissions/user-permissions.service';

@Component({
  selector: 'app-contractors',
  templateUrl: './contractors.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContractorsComponent implements OnDestroy {
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
        this.contractorsAndPortfoliosService.selectedContractor$
      ).map(([hasPermissions, selectedContractor]) => hasPermissions && !!selectedContractor)
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_DELETE,
      action: () => this.dialogAction = ContractorActionEnum.DELETE,
      enabled: Observable.combineLatest(
        this.canDelete$,
        this.contractorsAndPortfoliosService.selectedContractor$
      ).map(([hasPermissions, selectedContractor]) => hasPermissions && !!selectedContractor)
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_REFRESH,
      action: () => this.contractorsAndPortfoliosService.fetchContractors(),
      enabled: this.canView$
    }
  ];

  columns: Array<IGridColumn> = [
    { prop: 'id', minWidth: 50, maxWidth: 50 },
    { prop: 'name', minWidth: 120, maxWidth: 200 },
    { prop: 'fullName', minWidth: 120, maxWidth: 200 },
    { prop: 'smsName', minWidth: 120, maxWidth: 200 },
    { prop: 'responsibleName', minWidth: 100, maxWidth: 150 },
    { prop: 'typeCode', minWidth: 100, maxWidth: 150 },
    { prop: 'phone', minWidth: 100, maxWidth: 150 },
    { prop: 'address', minWidth: 100, maxWidth: 250 },
    { prop: 'comment', minWidth: 100, maxWidth: 250 },
  ];

  selectedContractor: IContractor;

  private dialogAction: ContractorActionEnum;

  private actionsSubscription: Subscription;
  private canViewSubscription: Subscription;
  private contractorsSubscription: Subscription;
  private dictionariesSubscription: Subscription;

  private renderers: IRenderer = {
    typeCode: []
  };

  constructor(
    private actions: Actions,
    private contentTabService: ContentTabService,
    private contractorsAndPortfoliosService: ContractorsAndPortfoliosService,
    private gridService: GridService,
    private notificationsService: NotificationsService,
    private userDictionariesService: UserDictionariesService,
    private userPermissionsService: UserPermissionsService,
  ) {

    this.dictionariesSubscription = this.userDictionariesService
      .getDictionaryAsOptions(UserDictionariesService.DICTIONARY_CONTRACTOR_TYPE)
      .subscribe(options => {
        this.renderers.typeCode = [].concat(options);
        this.columns = this.gridService.setRenderers(this.columns, this.renderers);
      });

    this.canViewSubscription = this.canView$.subscribe(canView => {
      if (canView) {
        this.contractorsAndPortfoliosService.fetchContractors();
      } else {
        this.contractorsAndPortfoliosService.clearContractors();
        this.notificationsService.error('errors.default.read.403').entity('entities.contractors.gen.plural').dispatch();
      }
    });

    this.contractorsSubscription = this.contractorsAndPortfoliosService.selectedContractor$.subscribe(contractor => {
      this.selectedContractor = contractor;
    });

    this.actionsSubscription = this.actions
      .ofType(ContractorsAndPortfoliosService.CONTRACTOR_DELETE_SUCCESS)
      .subscribe(() => this.dialogAction = null);
  }

  ngOnDestroy(): void {
    this.actionsSubscription.unsubscribe();
    this.canViewSubscription.unsubscribe();
    this.contractorsSubscription.unsubscribe();
    this.dictionariesSubscription.unsubscribe();
    this.contractorsAndPortfoliosService.clearContractors();
  }

  get isContractorBeingRemoved(): boolean {
    return this.dialogAction === ContractorActionEnum.DELETE;
  }

  get contractors$(): Observable<Array<IContractor>> {
    return this.contractorsAndPortfoliosService.contractors$;
  }

  get canView$(): Observable<boolean> {
    return this.userPermissionsService.has('CONTRACTOR_VIEW').filter(permission => permission !== undefined);
  }

  get canAdd$(): Observable<boolean> {
    return this.userPermissionsService.has('CONTRACTOR_ADD').filter(permission => permission !== undefined);
  }

  get canEdit$(): Observable<boolean> {
    return this.userPermissionsService.has('CONTRACTOR_EDIT').filter(permission => permission !== undefined);
  }

  get canDelete$(): Observable<boolean> {
    return this.userPermissionsService.has('CONTRACTOR_DELETE').filter(permission => permission !== undefined);
  }

  onAdd(): void {
    this.contentTabService.navigate(`/admin/contractors/create`);
  }

  onEdit(): void {
    this.contentTabService.navigate(`/admin/contractors/${this.selectedContractor.id}`);
  }

  onSelect(contractor: IContractor): void {
    this.contractorsAndPortfoliosService.selectContractor(contractor.id);
  }

  onRemoveSubmit(): void {
    this.contractorsAndPortfoliosService.deleteContractor();
  }

  onCloseDialog(): void {
    this.dialogAction = null;
  }
}
