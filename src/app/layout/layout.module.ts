import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { InfoDialogModule } from '../shared/components/dialog/info/info-dialog.module';
import { SharedModule } from '../shared/shared.module';

import { AccountMenuComponent } from './header/side-menu/account-menu/account-menu.component';
import { HeaderComponent } from './header/header.component';
import { LayoutComponent } from './layout.component';
import { MainMenuComponent } from './header/main-menu/main-menu.component';
import { NotificationsComponent } from './header/side-menu/notifications/notifications.component';
import { SideMenuComponent } from './header/side-menu/side-menu.component';
import { SidebarComponent } from './sidebar/sidebar.component';

@NgModule({
  imports: [
    InfoDialogModule,
    RouterModule,
    SharedModule,
  ],
  declarations: [
    AccountMenuComponent,
    HeaderComponent,
    LayoutComponent,
    MainMenuComponent,
    NotificationsComponent,
    SideMenuComponent,
    SidebarComponent,
  ],
  exports: [
    HeaderComponent,
    LayoutComponent,
    NotificationsComponent,
    SidebarComponent,
  ]
})
export class LayoutModule {}
