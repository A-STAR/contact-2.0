import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { DataTableModule, SharedModule as PngSharedModule, MultiSelectModule } from 'primeng/primeng';

import { NgxDatatableComponent } from './datatable/datatable.component';
import { TabledemoComponent } from './datatable/tabledemo.component';
import { SortableComponent } from './sortable/sortable.component';
import { TabComponent } from '../../shared/components/tabstrip/tab.component';
import { TabstripComponent } from '../../shared/components/tabstrip/tabstrip.component';
import { SharedModule } from '../../shared/shared.module';
import { GridService } from './grid.service';

const routes: Routes = [
    { path: 'large', component: TabledemoComponent },
    { path: 'sortable', component: SortableComponent },
];

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(routes),
        DataTableModule,
        PngSharedModule,
        NgxDatatableModule,
        MultiSelectModule
    ],
    declarations: [
        NgxDatatableComponent,
        SortableComponent,
        TabledemoComponent,
        TabComponent,
        TabstripComponent,
    ],
    exports: [
        RouterModule
    ],
    providers: [
      GridService
    ]
})
export class TablesModule { }
