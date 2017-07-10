import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { IContractor } from '../contractors-and-portfolios.interface';
import { IGridColumn } from '../../../../shared/components/grid/grid.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '../../../../shared/components/toolbar-2/toolbar-2.interface';

import { ContractorsAndPortfoliosService } from '../contractors-and-portfolios.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';
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
    { prop: 'type' },
    { prop: 'phone' },
    { prop: 'address' },
    { prop: 'comment' },
  ];

  private canViewSubscription: Subscription;

  constructor(
    private contractorsAndPortfoliosService: ContractorsAndPortfoliosService,
    private notificationsService: NotificationsService,
    private userPermissionsService: UserPermissionsService,
  ) {
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
    this.contractorsAndPortfoliosService.clearContractors();
    this.contractorsAndPortfoliosService.clearPortfolios();
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

  onEdit(contractor: IContractor): void {
    // TODO(d.maltsev)
  }

  onSelect(contractor: IContractor): void {
    // TODO(d.maltsev)
  }
}
