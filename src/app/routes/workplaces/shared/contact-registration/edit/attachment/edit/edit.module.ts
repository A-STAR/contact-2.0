import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';

import { AttachmentEditComponent } from './edit.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
  ],
  exports: [
    AttachmentEditComponent,
  ],
  declarations: [
    AttachmentEditComponent,
  ],
})
export class AttachmentEditModule {}
