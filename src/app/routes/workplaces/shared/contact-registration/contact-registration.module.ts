import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditModule } from './edit/edit.module';
import { SharedModule } from '@app/shared/shared.module';
import { TreeModule } from './tree/tree.module';

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
})
export class ContactRegistrationModule {}
