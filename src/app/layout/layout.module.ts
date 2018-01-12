import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { InfoDialogModule } from '../shared/components/dialog/info/info-dialog.module';
import { SharedModule } from '../shared/shared.module';

import { HeaderComponent } from './header/header.component';
import { LayoutComponent } from './layout.component';
import { MainMenuComponent } from './header/main-menu/main-menu.component';
import { NavsearchComponent } from './header/side-menu/navsearch/navsearch.component';
import { NotificationsComponent } from './header/side-menu/notifications/notifications.component';
import { SideMenuComponent } from './header/side-menu/side-menu.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { SidebarToggleComponent } from './sidebar/sidebar-toggle/sidebar-toggle.component';

@NgModule({
  imports: [
    InfoDialogModule,
    RouterModule,
    SharedModule,
  ],
  declarations: [
    HeaderComponent,
    LayoutComponent,
    MainMenuComponent,
    NavsearchComponent,
    NotificationsComponent,
    SideMenuComponent,
    SidebarComponent,
    SidebarToggleComponent,
  ],
  exports: [
    HeaderComponent,
    LayoutComponent,
    NavsearchComponent,
    NotificationsComponent,
    SidebarComponent,
  ]
})
export class LayoutModule {}
