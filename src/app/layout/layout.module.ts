import { NgModule } from '@angular/core';

import { LayoutComponent } from './layout.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderComponent } from './header/header.component';
import { NavsearchComponent } from './header/navsearch/navsearch.component';
import { OffsidebarComponent } from './offsidebar/offsidebar.component';

import { SharedModule } from '../shared/shared.module';

@NgModule({
    imports: [
        SharedModule
    ],
    providers: [
    ],
    declarations: [
        LayoutComponent,
        SidebarComponent,
        HeaderComponent,
        NavsearchComponent,
        OffsidebarComponent,
    ],
    exports: [
        LayoutComponent,
        SidebarComponent,
        HeaderComponent,
        NavsearchComponent,
        OffsidebarComponent,
    ]
})
export class LayoutModule { }
