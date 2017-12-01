import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '../../../shared/shared.module';

import { WorkTaskComponent } from './work-task.component';

const routes: Routes = [
  { path: '', component: WorkTaskComponent },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
  ],
  declarations: [
    WorkTaskComponent,
  ],
})
export class WorkTaskModule {}
