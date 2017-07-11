import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { IContractor } from '../contractors-and-portfolios.interface';
import { IGridColumn, IRenderer } from '../../../../shared/components/grid/grid.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '../../../../shared/components/toolbar-2/toolbar-2.interface';

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
      action: () => console.log('CONTRACTOR_ADD'),
      enabled: this.canAdd$
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_EDIT,
      action: () => console.log('CONTRACTOR_EDIT'),
      enabled: Observable.combineLatest(
        this.canEdit$,
        this.contractorsAndPortfoliosService.selectedContractor$
      ).map(([hasPermissions, selectedContractor]) => hasPermissions && !!selectedContractor)
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_DELETE,
      action: () => console.log('CONTRACTOR_DELETE'),
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
    { prop: 'name' },
    { prop: 'fullName' },
    { prop: 'smsName' },
    { prop: 'responsibleName' },
    { prop: 'typeCode' },
    { prop: 'phone' },
    { prop: 'address' },
    { prop: 'comment' },
  ];

  private canViewSubscription: Subscription;
  private dictionariesSubscription: Subscription;

  private renderers: IRenderer = {
    typeCode: []
  };

  constructor(
    private contentTabService: ContentTabService,
    private contractorsAndPortfoliosService: ContractorsAndPortfoliosService,
    private gridService: GridService,
    private notificationsService: NotificationsService,
    private userDictionariesService: UserDictionariesService,
    private userPermissionsService: UserPermissionsService,
  ) {
    this.userDictionariesService.preload([ UserDictionariesService.DICTIONARY_CONTRACTOR_TYPE ]);

    this.dictionariesSubscription = this.userDictionariesService.getDictionaryOptions(UserDictionariesService.DICTIONARY_CONTRACTOR_TYPE)
      .subscribe(options => {
        this.renderers.typeCode = [].concat(options);
        this.columns = this.gridService.setRenderers(this.columns, this.renderers);
      });

    this.canViewSubscription = this.canView$.subscribe(canView => {
      if (canView) {
        this.contractorsAndPortfoliosService.fetchContractors();
      } else {
        this.contractorsAndPortfoliosService.clearContractors();
        this.notificationsService.error('contractors.messages.accessDenied');
      }
    });
  }

  ngOnDestroy(): void {
    this.canViewSubscription.unsubscribe();
    this.dictionariesSubscription.unsubscribe();
    this.contractorsAndPortfoliosService.clearContractors();
  }

  get isContractorBeingRemoved(): boolean {
    return false;
  }

  get contractors$(): Observable<Array<IContractor>> {
    return this.contractorsAndPortfoliosService.contractors$;
  }

  get selectedContractor$(): Observable<IContractor> {
    return this.contractorsAndPortfoliosService.selectedContractor$;
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

  onEdit(contractor: IContractor): void {
    this.contentTabService.navigate(`/admin/contractors/${contractor.id}`);
  }

  onSelect(contractor: IContractor): void {
    this.contractorsAndPortfoliosService.selectContractor(contractor.id);
  }

  onRemoveSubmit(): void {
    console.log('onRemoveSubmit');
  }

  onCancel(): void {
    console.log('onCancel');
  }
}
