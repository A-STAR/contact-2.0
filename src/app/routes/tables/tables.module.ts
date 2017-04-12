import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Ng2TableModule } from 'ng2-table/ng2-table';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { NgxDatatableComponent } from './ngxdatatable/ngxdatatable.component';
import { SharedModule } from '../../shared/shared.module';

const routes: Routes = [
    { path: 'ngxdatatable', component: NgxDatatableComponent },
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
    ],
    exports: [
        RouterModule
    ]
})
export class TablesModule { }
