import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';

import { AttachmentEditModule } from './edit/edit.module';

import { AttachmentService } from './attachment.service';

import { ContactRegistrationAttachmentsComponent } from './attachment.component';

@NgModule({
  imports: [
    AttachmentEditModule,
    SharedModule,
  ],
  exports: [
    ContactRegistrationAttachmentsComponent,
  ],
  declarations: [
    ContactRegistrationAttachmentsComponent,
  ],
  providers: [
    AttachmentService,
  ]
})
export class AttachmentModule {}
