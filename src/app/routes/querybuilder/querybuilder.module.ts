import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QueryBuilderComponent } from './querybuilder.component';
import { SharedModule } from '../../shared/shared.module';

const routes: Routes = [
    { path: '', component: QueryBuilderComponent },
];

@NgModule({
    imports: [
      SharedModule,
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
