import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DynamicLoaderModule } from '@app/core/dynamic-loader/dynamic-loader.module';
import { InfoDialogModule } from '../shared/components/dialog/info/info-dialog.module';
import { SharedModule } from '../shared/shared.module';

import { AuthService } from '@app/core/auth/auth.service';
import { LayoutService } from './layout.service';

import { AccountMenuComponent } from './header/icon-menu/account-menu/account-menu.component';
import { PbxStatusComponent } from './header/icon-menu/pbx-status/pbx-status.component';
import { HeaderComponent } from './header/header.component';
import { LayoutComponent } from './layout.component';
import { MainMenuComponent } from './header/main-menu/main-menu.component';
import { NotificationsComponent } from './header/icon-menu/notifications/notifications.component';
import { IconMenuComponent } from './header/icon-menu/icon-menu.component';
import { PbxControlsComponent } from './header/icon-menu/pbx-controls/pbx-controls.component';
import { SidebarComponent } from './sidebar/sidebar.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [ AuthService ],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', loadChildren: 'app/routes/dashboard/dashboard.module#DashboardModule' },
      { path: 'admin', loadChildren: 'app/routes/admin/admin.module#AdminModule' },
      { path: 'workplaces', loadChildren: 'app/routes/workplaces/workplaces.module#WorkplacesModule' },
      { path: 'utilities', loadChildren: 'app/routes/utilities/utilities.module#UtilitiesModule' },
      { path: 'reports', loadChildren: 'app/routes/reports/reports.module#ReportsModule' },
      { path: 'help', loadChildren: 'app/routes/ui/ui.module#UIModule' },
    ]
  },
];

@NgModule({
  imports: [
    DynamicLoaderModule.withModules(
      [
        {
          path: 'licence',
          loadChildren: 'app/layout/dynamic-popups/licence/licence.module#LicenceModule',
        },
      ],
    ),
    InfoDialogModule,
    RouterModule.forChild(routes),
    SharedModule,
  ],
  declarations: [
    AccountMenuComponent,
    PbxStatusComponent,
    HeaderComponent,
    IconMenuComponent,
    LayoutComponent,
    MainMenuComponent,
    NotificationsComponent,
    PbxControlsComponent,
    SidebarComponent,
  ],
  exports: [
    HeaderComponent,
    LayoutComponent,
    NotificationsComponent,
    RouterModule,
    SidebarComponent,
  ],
  providers: [
    LayoutService
  ]
})
export class LayoutModule {}
