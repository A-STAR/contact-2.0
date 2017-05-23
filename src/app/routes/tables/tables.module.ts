import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
  DataTableModule,
  SharedModule as PngSharedModule,
  MultiSelectModule,
  ButtonModule,
  DialogModule
} from 'primeng/primeng';

import { TabledemoComponent } from './datatable/tabledemo.component';
import { SharedModule } from '../../shared/shared.module';

const routes: Routes = [
  { path: 'large', component: TabledemoComponent },
];

@NgModule({
  imports: [
    ButtonModule,
    DataTableModule,
    DialogModule,
    MultiSelectModule,
    PngSharedModule,
    RouterModule.forChild(routes),
    SharedModule,
  ],
  declarations: [
    TabledemoComponent,
  ],
  exports: [
    RouterModule,
  ],
})
export class TablesModule { }
