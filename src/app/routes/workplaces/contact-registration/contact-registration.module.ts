import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StepsModule } from 'primeng/primeng';

import { OutcomeFormModule } from './outcome-form/outcome-form.module';
import { SharedModule } from '../../../shared/shared.module';

import { ContactRegistrationComponent } from './contact-registration.component';

const routes: Routes = [
  { path: '', component: ContactRegistrationComponent },
];

@NgModule({
  imports: [
    OutcomeFormModule,
    RouterModule.forChild(routes),
    SharedModule,
    StepsModule,
  ],
  declarations: [
    ContactRegistrationComponent,
  ],
})
export class ContactRegistrationModule {}
