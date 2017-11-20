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
    CallCenterComponent: 'CALL_CENTER',
    CampaignComponent: 'CALL_CENTER',
    ConstantsComponent: 'CONSTANTS',
    ContactLogComponent: 'CONTACT_LOG',
    ContactRegistrationComponent: 'CONTACT_REGISTRATION',
    ContactPropertiesComponent: 'CONTACT_TREES',
    ContractorsAndPortfoliosComponent: 'PORTFOLIOS',
    ContractorEditComponent: 'CONTRACTOR',
    ContractorManagersComponent: 'CONTRACTOR_MANAGERS',
    ContractorManagerEditComponent: 'CONTRACTOR_MANAGER',
    DashboardComponent: 'HOME',
    DebtorComponent: 'DEBTOR_CARD',
    DebtorActionLogComponent: 'DEBTOR_ACTION_LOG',
    DebtorAddressComponent: 'DEBTOR_ADDRESS',
    DebtorContactsComponent: 'DEBTOR_DEBT_CONTACTS',
    DebtorContactLogTabComponent: 'DEBTOR_CONTACT_LOG_COMPONENT',
    DebtorDebtComponent: 'DEBTOR_DEBT',
    DebtorDebtComponentComponent: 'DEBTOR_DEBT_COMPONENT',
    DebtorDocumentComponent: 'DEBTOR_DOCUMENT',
    DebtorEmailComponent: 'DEBTOR_EMAIL',
    DebtorEmploymentComponent: 'DEBTOR_EMPLOYMENT',
    DebtorGuarantorComponent: 'DEBTOR_GUARANTEE',
    DebtorIdentityComponent: 'DEBTOR_IDENTITY',
    DebtorPaymentComponent: 'DEBTOR_PAYMENT',
    DebtorPhoneComponent: 'DEBTOR_PHONE',
    DebtorPromiseComponent: 'DEBTOR_PROMISE',
    DebtorPropertyComponent: 'DEBTOR_PROPERTY',
    DebtorPledgeComponent: 'DEBTOR_PLEDGE',
    DebtorsComponent: 'DEBT_LIST',
    DebtProcessingComponent: 'DEBTS',
    DictionariesComponent: 'DICTIONARIES',
    HelpComponent: 'HELP',
    IncomingCallComponent: 'INCOMING_CALL',
    MessageTemplatesComponent: 'MESSAGE_SCENARIOS',
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
    // log('deactivated', component.name);
  }

  activate(config: any): void {
    const { component, factory, injector } = config;
    // log('activate', component.COMPONENT_NAME);
    const path: string = this.router.url;
    const key = this.titles[component.COMPONENT_NAME];
    const title: string = key ? `sidebar.nav.menu.${key}` : 'Title';
    const tab = { title, component, path, factory, injector };
    this.tabService.addTab(tab);
  }
}
