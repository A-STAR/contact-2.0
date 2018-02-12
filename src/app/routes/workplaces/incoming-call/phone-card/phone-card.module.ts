import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '../../../../shared/shared.module';
import { WorkplacesSharedModule } from '@app/routes/workplaces/shared/shared.module';

import { PhoneCardComponent } from './phone-card.component';

const routes: Routes = [
  {
    path: '',
    component: PhoneCardComponent,
    data: {
      reuse: true,
    },
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    WorkplacesSharedModule,
  ],
  declarations: [
    PhoneCardComponent,
  ],
  exports: [
    RouterModule,
  ]
})
export class PhoneCardModule {}
