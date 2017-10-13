import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StepsModule } from 'primeng/primeng';

import { OutcomeFormModule } from './outcome-form/outcome-form.module';
import { ParametersFormModule } from './parameters-form/parameters-form.module';
import { SharedModule } from '../../../shared/shared.module';

import { ContactRegistrationService } from './contact-registration.service';

import { ContactRegistrationComponent } from './contact-registration.component';

const routes: Routes = [
  { path: ':debtId/:contactTypeCode', component: ContactRegistrationComponent },
];

@NgModule({
  imports: [
    OutcomeFormModule,
    ParametersFormModule,
    RouterModule.forChild(routes),
    SharedModule,
    StepsModule,
  ],
  declarations: [
    ContactRegistrationComponent,
  ],
  providers: [
    ContactRegistrationService,
  ],
})
export class ContactRegistrationModule {}