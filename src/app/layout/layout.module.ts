import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { InfoDialogModule } from '../shared/components/dialog/info/info-dialog.module';
import { SharedModule } from '../shared/shared.module';

import { LayoutComponent } from './layout.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderComponent } from './header/header.component';
import { NavsearchComponent } from './header/navsearch/navsearch.component';
import { NotificationsComponent } from './header/notifications/notifications.component';
import { SidebarToggleComponent } from './sidebar/sidebar-toggle/sidebar-toggle.component';
import { HeaderMenuComponent } from './header/header-menu/header-menu.component';

@NgModule({
  imports: [
    InfoDialogModule,
    RouterModule,
    SharedModule,
  ],
  declarations: [
    HeaderComponent,
    LayoutComponent,
    NavsearchComponent,
    NotificationsComponent,
    SidebarComponent,
    SidebarToggleComponent,
    HeaderMenuComponent,
  ],
  exports: [
    HeaderComponent,
    LayoutComponent,
    NavsearchComponent,
    NotificationsComponent,
    SidebarComponent,
  ]
})
export class LayoutModule { }
