import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { MenuService } from '../core/menu/menu.service';
import { ContentTabService } from '../shared/components/content-tabstrip/tab/content-tab.service';

import { ITab } from '../shared/components/content-tabstrip/tab/content-tab.interface';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {
  titles = {
    ConstantsComponent: 'CONSTANTS',
    DashboardComponent: 'HOME',
    DictAndTermsComponent: 'DICTIONARIES',
    OrganizationsComponent: 'DEPARTMENTS',
    RolesAndPermissionsComponent: 'ROLES_AND_PERMISSIONS',
    UsersComponent: 'USERS',
    UserEditComponent: 'USER_EDIT',
    HelpComponent: 'HELP',
    ActionsLogComponent: 'ACTIONS_LOG',
    DebtorComponent: 'DEBTOR_CARD',
    DebtorsComponent: 'DEBT_LIST',
  };

  constructor(
    private menuService: MenuService,
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
