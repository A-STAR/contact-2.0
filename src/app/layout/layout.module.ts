import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { ContentTabstripModule } from '../shared/components/content-tabstrip/content-tabstrip.module';

import { LayoutComponent } from './layout.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderComponent } from './header/header.component';
import { NavsearchComponent } from './header/navsearch/navsearch.component';
import { NotificationsComponent } from './header/notifications/notifications.component';

@NgModule({
  imports: [
    ContentTabstripModule,
    SharedModule,
  ],
  declarations: [
    LayoutComponent,
    SidebarComponent,
    HeaderComponent,
    NavsearchComponent,
    NotificationsComponent,
  ],
  exports: [
    LayoutComponent,
    SidebarComponent,
    HeaderComponent,
    NavsearchComponent,
    NotificationsComponent,
  ]
})
export class LayoutModule { }
