import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AttachmentModule } from './attachment/attachment.module';
import { AttributesModule } from './attributes/attributes.module';
import { ContactSelectModule } from './contact-select/contact-select.module';
import { SelectModule } from '@app/shared/components/form/select/select.module';
import { SharedModule } from '@app/shared/shared.module';

import { EditComponent } from './edit.component';

@NgModule({
  imports: [
    AttachmentModule,
    AttributesModule,
    ContactSelectModule,
    FormsModule,
    SelectModule,
    SharedModule,
  ],
  exports: [
    EditComponent,
  ],
  declarations: [
    EditComponent,
  ],
})
export class EditModule {}
