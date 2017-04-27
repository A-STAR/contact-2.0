import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
  DataTableModule,
  SharedModule as PngSharedModule,
  MultiSelectModule,
  ButtonModule,
  DialogModule
} from 'primeng/primeng';
import { CurrencyMaskModule } from 'ng2-currency-mask';

// import { GridModule } from '../../shared/components/grid/grid.module';
// import { GridComponent } from '../../shared/components/grid/grid.component';
import { TabledemoComponent } from './datatable/tabledemo.component';
import { GroupableComponent } from './groupable/groupable.component';
import { ReorderableComponent } from './reorderable/reorderable.component';
import { SortableComponent } from './sortable/sortable.component';
import { TabComponent } from '../../shared/components/tabstrip/tab.component';
import { TabstripComponent } from '../../shared/components/tabstrip/tabstrip.component';
import { SharedModule } from '../../shared/shared.module';
// import { GridService } from '../../shared/components/grid/grid.service';

const routes: Routes = [
    { path: 'large', component: TabledemoComponent },
    { path: 'sortable', component: SortableComponent },
    { path: 'reorderable', component: ReorderableComponent },
    { path: 'groupable', component: GroupableComponent },
];

@NgModule({
    imports: [
        ButtonModule,
        CurrencyMaskModule,
        DataTableModule,
        DialogModule,
        MultiSelectModule,
        // GridModule,
        PngSharedModule,
        RouterModule.forChild(routes),
        SharedModule,
    ],
    declarations: [
        // GridComponent,
        GroupableComponent,
        ReorderableComponent,
        SortableComponent,
        TabComponent,
        TabledemoComponent,
        TabstripComponent
    ],
    exports: [
        RouterModule,
    ],
    providers: [
      // GridService
    ]
})
export class TablesModule { }
