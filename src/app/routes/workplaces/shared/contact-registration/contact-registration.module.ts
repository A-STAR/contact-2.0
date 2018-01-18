import { NgModule } from '@angular/core';

import { EditModule } from './edit/edit.module';
import { OverviewModule } from './overview/overview.module';
import { SharedModule } from '@app/shared/shared.module';

import { ContactRegistrationService } from './contact-registration.service';

import { ContactRegistrationComponent } from './contact-registration.component';

@NgModule({
  imports: [
    EditModule,
    OverviewModule,
    SharedModule,
  ],
  exports: [
    ContactRegistrationComponent,
  ],
  declarations: [
    ContactRegistrationComponent,
  ],
  providers: [
    ContactRegistrationService,
  ],
})
export class ContactRegistrationModule {}
