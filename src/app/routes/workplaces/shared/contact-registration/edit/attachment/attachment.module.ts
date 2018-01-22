import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';

import { AttachmentEditModule } from './edit/edit.module';

import { AttachmentService } from './attachment.service';

import { AttachmentComponent } from './attachment.component';

@NgModule({
  imports: [
    AttachmentEditModule,
    SharedModule,
  ],
  exports: [
    AttachmentComponent,
  ],
  declarations: [
    AttachmentComponent,
  ],
  providers: [
    AttachmentService,
  ]
})
export class AttachmentModule {}
