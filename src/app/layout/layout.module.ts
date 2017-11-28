import { NgModule } from '@angular/core';

import { InfoDialogModule } from '../shared/components/dialog/info/info-dialog.module';
import { ContentTabstripModule } from '../shared/components/content-tabstrip/content-tabstrip.module';
import { SharedModule } from '../shared/shared.module';

import { LayoutComponent } from './layout.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderComponent } from './header/header.component';
import { NavsearchComponent } from './header/navsearch/navsearch.component';
import { NotificationsComponent } from './header/notifications/notifications.component';
import { SidebarToggleComponent } from './sidebar/sidebar-toggle/sidebar-toggle.component';

@NgModule({
  imports: [
    ContentTabstripModule,
    InfoDialogModule,
    SharedModule,
  ],
  declarations: [
    HeaderComponent,
    LayoutComponent,
    NavsearchComponent,
    NotificationsComponent,
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
export class LayoutModule { }
