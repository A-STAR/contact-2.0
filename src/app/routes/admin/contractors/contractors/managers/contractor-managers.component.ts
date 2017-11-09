import { ChangeDetectionStrategy, Component, OnDestroy, ChangeDetectorRef} from '@angular/core';
import { Actions } from '@ngrx/effects';
import { ActivatedRoute, Router} from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { IContractorManager } from '../../contractors-and-portfolios.interface';
import { IGridColumn, IRenderer } from '../../../../../shared/components/grid/grid.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '../../../../../shared/components/toolbar-2/toolbar-2.interface';
import { ContractorManagerActionEnum } from './contractor-managers.interface';

import { ContentTabService } from '../../../../../shared/components/content-tabstrip/tab/content-tab.service';
import { ContractorsAndPortfoliosService } from '../../contractors-and-portfolios.service';
import { GridService } from '../../../../../shared/components/grid/grid.service';
import { NotificationsService } from '../../../../../core/notifications/notifications.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '../../../../../core/user/permissions/user-permissions.service';


import { DialogFunctions } from '../../../../../core/dialog';


import { MessageBusService } from '../../../../../core/message-bus/message-bus.service';

@Component({
  selector: 'app-contractor-managers',
  templateUrl: './contractor-managers.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContractorManagersComponent extends DialogFunctions  implements OnDestroy {
  static COMPONENT_NAME = 'ContractorManagersComponent';
  private contractorId = Number((this.activatedRoute.params as any).value.id);
  dialog: string;


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
        this.contractorsAndPortfoliosService.selectedManagerId$
      ).map(([hasPermissions, mappedId]) => hasPermissions && mappedId && !!mappedId[this.contractorId])
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_DELETE,
      action: () => this.setDialog('delete'),
      enabled: Observable.combineLatest(
        this.canDelete$,
        this.contractorsAndPortfoliosService.selectedManagerId$
      ).map(([hasPermissions, mappedId]) => hasPermissions && mappedId && !!mappedId[this.contractorId])
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_REFRESH,
      // TODO
      action: () => this.needToReadAllManagers$.next(' '),
      enabled: this.canView$
    }
  ];

  columns: Array<IGridColumn> = [
    // { prop: 'fullName' },
    { prop: 'lastName', minWidth: 120, maxWidth: 200 },
    { prop: 'firstName', minWidth: 120, maxWidth: 200 },
    { prop: 'middleName', minWidth: 120, maxWidth: 200 },
    { prop: 'genderCode', minWidth: 100, maxWidth: 150 },
    { prop: 'position', minWidth: 100, maxWidth: 150 },
    { prop: 'branchCode', minWidth: 100, maxWidth: 150 },
    { prop: 'mobPhone', minWidth: 100, maxWidth: 150 },
    { prop: 'workPhone', minWidth: 100, maxWidth: 150 },
    { prop: 'intPhone', minWidth: 100, maxWidth: 150 },
    { prop: 'workAddress', minWidth: 100, maxWidth: 250 },
    { prop: 'email', minWidth: 100, maxWidth: 200 },
    { prop: 'comment', minWidth: 100, maxWidth: 250 },
  ];

  private canViewSubscription: Subscription;
  private dialogAction: ContractorManagerActionEnum;
  private dictionariesSubscription: Subscription;
  private managersSubscription: Subscription;
  private actionsSubscription: Subscription;

  // private selectedManager: IContractorManager[];
  selection: IContractorManager[];
  rows: IContractorManager[];
  private _managers: IContractorManager[];
  private needToReadAllManagers$ = new BehaviorSubject<string>(null);

  private renderers: IRenderer = {
    branchCode: [],
    genderCode: []
  };

  constructor(
    private actions: Actions,
    private activatedRoute: ActivatedRoute,
    private contentTabService: ContentTabService,
    private contractorsAndPortfoliosService: ContractorsAndPortfoliosService,
    private router: Router,
    private messageBusService: MessageBusService,
    private cdRef: ChangeDetectorRef,
    private gridService: GridService,
    private notificationsService: NotificationsService,
    private userDictionariesService: UserDictionariesService,
    private userPermissionsService: UserPermissionsService,
  ) {
    super();
    this.dictionariesSubscription = Observable.combineLatest(
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_BRANCHES),
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_GENDER)
    ).subscribe(([ branchOptions, genderOptions ]) => {
      this.renderers.branchCode = [].concat(branchOptions);
      this.renderers.genderCode = [].concat(genderOptions);
      this.columns = this.gridService.setRenderers(this.columns, this.renderers);
    });

    this.canViewSubscription = this.canView$.subscribe(canView => {
      if (canView) {
        this.needToReadAllManagers$
          .flatMap(() => this.contractorsAndPortfoliosService.readManagersForContractor(this.contractorId))
          .subscribe((managers: IContractorManager[]) => {
            console.log('update managers in grid constructor', managers);
            this.managers = managers;
            this.cdRef.markForCheck();
          });
        this.needToReadAllManagers$.next(' ');
      } else {
        this.clearManagers();
        this.notificationsService.error('errors.default.read.403').entity('entities.managers.gen.plural').dispatch();
      }
    });

    this.messageBusService
          .select(ContractorsAndPortfoliosService.MANAGERS_FETCH)
          .subscribe(() => {
            console.log('catch need to fetch managers');
            this.needToReadAllManagers$.next(' ');
          });



    this.managersSubscription = this.contractorsAndPortfoliosService.selectedManagerId$
      .subscribe(mappedId => {
        this.selection = mappedId && mappedId[this.contractorId] &&
            this.managers && this.managers.find(manager => manager.id === mappedId[this.contractorId])
        ? [ this.managers.find(manager => manager.id === mappedId[this.contractorId]) ]
        : [];
        console.log('manager id in constructor manager grid', this.selection);
      });

    this.actionsSubscription = this.actions
      .ofType(ContractorsAndPortfoliosService.MANAGER_DELETE_SUCCESS)
      .subscribe(() => this.setDialog());
  }

  set managers(newManagers: IContractorManager[]) {
    this._managers = newManagers;
    console.log('current selection, store', this.selection, this.contractorsAndPortfoliosService.managerMapping);
    if ( this.contractorsAndPortfoliosService.managerMapping &&
      this.contractorsAndPortfoliosService.managerMapping[this.contractorId] && this._managers.length) {
      this.selection =
        [ this._managers.find((manager) => manager.id ===
          this.contractorsAndPortfoliosService.managerMapping[this.contractorId])];
    }
  }

  get managers(): IContractorManager[] {
    return this._managers;
  }

  clearManagers (): void {
    this.contractorsAndPortfoliosService.selectManager(this.contractorId, null);
    this.managers = [];
  }

  ngOnDestroy(): void {
    this.canViewSubscription.unsubscribe();
    this.dictionariesSubscription.unsubscribe();
  }

  get isManagerBeingRemoved(): boolean {
    return this.dialogAction === ContractorManagerActionEnum.DELETE;
  }

  get canView$(): Observable<boolean> {
    return this.userPermissionsService.has('CONTRACTOR_MANAGER_VIEW').filter(permission => permission !== undefined);
  }

  get canAdd$(): Observable<boolean> {
    return this.userPermissionsService.has('CONTRACTOR_MANAGER_ADD').filter(permission => permission !== undefined);
  }

  get canEdit$(): Observable<boolean> {
    return this.userPermissionsService.has('CONTRACTOR_MANAGER_EDIT').filter(permission => permission !== undefined);
  }

  get canDelete$(): Observable<boolean> {
    return this.userPermissionsService.has('CONTRACTOR_MANAGER_DELETE').filter(permission => permission !== undefined);
  }

  onAdd(): void {
    this.contentTabService.navigate(`/admin/contractors/${this.contractorId}/managers/create`);
  }

  onEdit(): void {
    console.log(this.selection);
    this.contentTabService.navigate(`/admin/contractors/${this.contractorId}/managers/${this.selection[0].id}`);
  }

  onSelect(manager: IContractorManager): void {
    // this.selection = [this.managers[1]];
    console.log('selection:', this.selection);
    this.selection = [manager];
    this.contractorsAndPortfoliosService.selectManager(this.contractorId, manager.id);
  }

  onBack(): void {
    this.contentTabService.gotoParent(this.router, 1);
    // this.contentTabService.navigate(`/admin/contractors/${this.contractorId}`);
  }

  onRemoveSubmit(): void {
    this.contractorsAndPortfoliosService.deleteManager(this.contractorId, this.selection[0].id)
      .subscribe(() => {
        this.setDialog();
        this.needToReadAllManagers$.next('');
      });
  }

  onCloseDialog(): void {
    this.setDialog();
  }
}
