import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../shared/shared.module';

import { AttachmentEditModule } from './edit/edit.module';

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
})
export class AttachmentModule {}
