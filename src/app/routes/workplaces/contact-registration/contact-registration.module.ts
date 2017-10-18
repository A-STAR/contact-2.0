import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StepsModule } from 'primeng/primeng';

import { AttributesModule } from './attributes/attributes.module';
import { OutcomeModule } from './outcome/outcome.module';
import { PromiseModule } from './promise/promise.module';
import { SharedModule } from '../../../shared/shared.module';

import { ContactRegistrationService } from './contact-registration.service';

import { ContactRegistrationComponent } from './contact-registration.component';

const routes: Routes = [
  { path: ':debtId/:contactTypeCode', component: ContactRegistrationComponent },
];

@NgModule({
  imports: [
    AttributesModule,
    OutcomeModule,
    PromiseModule,
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
