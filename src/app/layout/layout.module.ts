import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';

import { LayoutComponent } from './layout.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderComponent } from './header/header.component';
import { NavsearchComponent } from './header/navsearch/navsearch.component';


@NgModule({
    imports: [
        SharedModule
    ],
    declarations: [
        LayoutComponent,
        SidebarComponent,
        HeaderComponent,
        NavsearchComponent,
    ],
    exports: [
        LayoutComponent,
        SidebarComponent,
        HeaderComponent,
        NavsearchComponent,
    ]
})
export class LayoutModule { }
