import { Component } from '@angular/core';
import { Router } from '@angular/router';

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
    console.log('activate', component.COMPONENT_NAME);
    const path: string = this.router.url;
    const title: string = this.titles[`sidebar.nav.menu.${component.COMPONENT_NAME}`] || 'Title';

    const tab = { title, active: true, component, path, factory, injector };
    this.tabService.addTab(tab);
  }
}
