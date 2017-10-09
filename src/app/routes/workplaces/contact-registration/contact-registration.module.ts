import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '../../../shared/shared.module';

import { ContactRegistrationComponent } from './contact-registration.component';

const routes: Routes = [
  { path: '', component: ContactRegistrationComponent },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
  ],
  declarations: [
    ContactRegistrationComponent,
  ],
})
export class ContactRegistrationModule {}
