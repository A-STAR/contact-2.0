import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditModule } from './edit/edit.module';
import { SharedModule } from '@app/shared/shared.module';
import { TreeModule } from './tree/tree.module';

import { ContactRegistrationService } from './contact-registration.service';

import { ContactRegistrationComponent } from './contact-registration.component';

@NgModule({
  imports: [
    CommonModule,
    EditModule,
    SharedModule,
    TreeModule,
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
