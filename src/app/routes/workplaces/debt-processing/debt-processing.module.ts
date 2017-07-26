import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';

import { SharedModule } from '../../../shared/shared.module';

import { DebtProcessingEffects } from './debt-processing.effects';
import { DebtProcessingService } from './debt-processing.service';

import { DebtProcessingComponent } from './debt-processing.component';

const routes: Routes = [
  { path: '', component: DebtProcessingComponent },
];

@NgModule({
  imports: [
    EffectsModule.run(DebtProcessingEffects),
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
    DebtProcessingService
  ]
})
export class DebtProcessingModule {
}
