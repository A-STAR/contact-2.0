import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../shared/shared.module';

import { AttachmentComponent } from './attachment.component';

@NgModule({
  imports: [
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
