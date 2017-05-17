import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { DepartmentsComponent } from './departments.component';
import { DepartmentsService } from './departments.service';

const routes: Routes = [
    { path: '', component: DepartmentsComponent },
];

@NgModule({
    imports: [
      SharedModule,
      RouterModule.forChild(routes),
    ],
    exports: [
      RouterModule,
    ],
    providers: [
      DepartmentsService
    ],
    declarations: [
      DepartmentsComponent,
    ]
})
export class DepartmentsModule { }
