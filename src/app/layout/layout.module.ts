import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { InfoDialogModule } from '../shared/components/dialog/info/info-dialog.module';
import { SharedModule } from '../shared/shared.module';

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

@NgModule({
  imports: [
    InfoDialogModule,
    RouterModule,
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
    SidebarComponent,
  ],
  providers: [
    LayoutService
  ]
})
export class LayoutModule {}
