import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { DialogModule } from 'primeng/primeng';
import { QueryBuilderComponent } from './querybuilder.component';
import { QBuilderComponent } from '../../shared/components/qbuilder/qbuilder.component';
import { QBuilderService } from '../../shared/components/qbuilder/qbuilder.service';

const routes: Routes = [
    { path: '', component: QueryBuilderComponent },
];

@NgModule({
    imports: [
      CommonModule,
      DialogModule,
      FormsModule,
      RouterModule.forChild(routes),
    ],
    exports: [
      RouterModule
    ],
    declarations: [
      QueryBuilderComponent,
      QBuilderComponent
    ],
    providers: [
      QBuilderService
    ]
})
export class QueryBuilderModule { }
