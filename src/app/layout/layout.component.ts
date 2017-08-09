import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { ITab } from '../shared/components/content-tabstrip/tab/content-tab.interface';

import { ContentTabService } from '../shared/components/content-tabstrip/tab/content-tab.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {
  titles = {
    ActionsLogComponent: 'ACTIONS_LOG',
    ConstantsComponent: 'CONSTANTS',
    ContractorsAndPortfoliosComponent: 'PORTFOLIOS',
    ContractorEditComponent: 'CONTRACTOR',
    ContractorManagersComponent: 'CONTRACTOR_MANAGERS',
    ContractorManagerEditComponent: 'CONTRACTOR_MANAGER',
    DashboardComponent: 'HOME',
    DebtorComponent: 'DEBTOR_CARD',
    DebtorAddressComponent: 'DEBTOR_ADDRESS',
    DebtorDebtComponent: 'DEBTOR_DEBT',
    DebtorEmailComponent: 'DEBTOR_EMAIL',
    DebtorPhoneComponent: 'DEBTOR_PHONE',
    DebtorsComponent: 'DEBT_LIST',
    DebtProcessingComponent: 'DEBTS',
    DictAndTermsComponent: 'DICTIONARIES',
    HelpComponent: 'HELP',
    OrganizationsComponent: 'DEPARTMENTS',
    RolesAndPermissionsComponent: 'ROLES_AND_PERMISSIONS',
    UsersComponent: 'USERS',
    UserEditComponent: 'USER_EDIT',
  };

  constructor(
    private router: Router,
    private tabService: ContentTabService,
  ) {}

  get tabs(): ITab[] {
    return this.tabService.tabs;
  }

  deactivate(component: any): void {
    // console.log('deactivated', component.name);
  }

  activate(config: any): void {
    const { component, factory, injector } = config;
    // console.log('activate', component.COMPONENT_NAME);
    const path: string = this.router.url;
    const key = this.titles[component.COMPONENT_NAME];
    const title: string = key ? `sidebar.nav.menu.${key}` : 'Title';
    const tab = { title, component, path, factory, injector };
    this.tabService.addTab(tab);
  }
}
