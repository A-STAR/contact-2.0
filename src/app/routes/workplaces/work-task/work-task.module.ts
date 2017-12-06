import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '../../../shared/shared.module';
import { GridModule } from './grid/grid.module';
import { SleekTabstripModule } from './tabstrip/tabstrip.module';

import { WorkTaskService } from './work-task.service';

import { WorkTaskComponent } from './work-task.component';

const routes: Routes = [
  { path: '', component: WorkTaskComponent },
];

@NgModule({
  imports: [
    GridModule,
    RouterModule.forChild(routes),
    SharedModule,
    SleekTabstripModule,
  ],
  declarations: [
    WorkTaskComponent,
  ],
  providers: [
    WorkTaskService,
  ]
})
export class WorkTaskModule {}
