import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '../../../shared/shared.module';
import { GridModule } from './grid/grid.module';

import { WorkTaskService } from './work-task.service';

import { WorkTaskComponent } from './work-task.component';

const routes: Routes = [
  { path: '', component: WorkTaskComponent },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    GridModule,
  ],
  declarations: [
    WorkTaskComponent,
  ],
  providers: [
    WorkTaskService,
  ]
})
export class WorkTaskModule {}
