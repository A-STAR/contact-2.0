import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Ng2TableModule } from 'ng2-table/ng2-table';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { NgxDatatableComponent } from './ngxdatatable/ngxdatatable.component';
import { TabledemoComponent } from './ngxdatatable/tabledemo.component';
import { TabComponent } from '../../shared/components/tabstrip/tab.component';
import { TabstripComponent } from '../../shared/components/tabstrip/tabstrip.component';
import { SharedModule } from '../../shared/shared.module';

const routes: Routes = [
    { path: '', component: TabledemoComponent },
];

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(routes),
        Ng2TableModule,
        NgxDatatableModule,
    ],
    declarations: [
        NgxDatatableComponent,
        TabledemoComponent,
        TabComponent,
        TabstripComponent,
    ],
    exports: [
        RouterModule
    ]
})
export class TablesModule { }
