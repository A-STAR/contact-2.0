import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DialogModule } from 'primeng/primeng';
import { QueryBuilderComponent } from './querybuilder.component';
import { SharedModule } from '../../shared/shared.module';

const routes: Routes = [
    { path: '', component: QueryBuilderComponent },
];

@NgModule({
    imports: [
      SharedModule,
      DialogModule,
      RouterModule.forChild(routes),
    ],
    exports: [
      RouterModule
    ],
    declarations: [
      QueryBuilderComponent,
    ]
})
export class QueryBuilderModule { }
