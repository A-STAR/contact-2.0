import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GridModule } from './grid/grid.module';
import { SharedModule } from '../../../shared/shared.module';

import { DebtProcessingService } from './debt-processing.service';

import { DebtProcessingComponent } from './debt-processing.component';

const routes: Routes = [
  { path: '', component: DebtProcessingComponent },
];

@NgModule({
  imports: [
    GridModule,
    RouterModule.forChild(routes),
    SharedModule,
  ],
  exports: [
    RouterModule,
  ],
  declarations: [
    DebtProcessingComponent,
  ],
  providers: [
    DebtProcessingService,
    { provide: 'entityTypeId', useValue: 19 },
    { provide: 'manualGroup', useValue: true }
  ]
})
export class DebtProcessingModule {
}
