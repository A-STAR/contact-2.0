import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IContractor } from '../contractors-and-portfolios.interface';
import { IGridColumn } from '../../../../shared/components/grid/grid.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '../../../../shared/components/toolbar-2/toolbar-2.interface';

import { ContractorsAndPortfoliosService } from '../contractors-and-portfolios.service';
import { UserPermissionsService } from '../../../../core/user/permissions/user-permissions.service';

@Component({
  selector: 'app-contractors',
  templateUrl: './contractors.component.html'
})
export class ContractorsComponent {
  toolbarItems: Array<IToolbarItem> = [
    {
      type: ToolbarItemTypeEnum.BUTTON_ADD,
      action: () => console.log('BANK_ADD'),
      enabled: this.userPermissionsService.has('BANK_ADD')
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_EDIT,
      action: () => console.log('BANK_EDIT'),
      enabled: Observable.combineLatest(
        this.userPermissionsService.has('BANK_EDIT'),
        this.contractorsAndPortfoliosService.selectedContractor$
      ).map(([hasPermissions, selectedContractor]) => hasPermissions && !!selectedContractor)
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_DELETE,
      action: () => console.log('BANK_DELETE'),
      enabled: Observable.combineLatest(
        this.userPermissionsService.has('BANK_DELETE'),
        this.contractorsAndPortfoliosService.selectedContractor$
      ).map(([hasPermissions, selectedContractor]) => hasPermissions && !!selectedContractor)
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_REFRESH,
      action: () => this.contractorsAndPortfoliosService.fetchContractors(),
      enabled: this.userPermissionsService.has('BANK_VIEW')
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

  canEdit$: Observable<boolean>;
  contractors$: Observable<Array<IContractor>> = Observable.of([]);

  constructor(
    private contractorsAndPortfoliosService: ContractorsAndPortfoliosService,
    private userPermissionsService: UserPermissionsService,
  ) {
    this.canEdit$ = this.userPermissionsService.has('BANK_EDIT');
  }

  onEdit(contractor: IContractor): void {
    // TODO(d.maltsev)
  }

  onSelect(contractor: IContractor): void {
    // TODO(d.maltsev)
  }
}
