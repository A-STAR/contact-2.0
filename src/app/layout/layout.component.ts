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
    ConstantsComponent: 'constants.title',
    DashboardComponent: 'sidebar.nav.menu.HOME',
    DictAndTermsComponent: 'sidebar.nav.menu.DICTIONARIES',
    OrganizationsComponent: 'organizations.title',
    RolesAndPermissionsComponent: 'sidebar.nav.menu.ROLES_AND_PERMISSIONS',
    UsersComponent: 'users.title',
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
    console.log('activated', component.name);
    const path: string = this.router.url;
    const title: string = this.titles[component.name] || 'Title';

    const tab = { title, active: true, component, path, factory, injector };
    this.tabService.addTab(tab);

    this.menuService.onMenuLoadFinish();
  }
}
