import { NgModule } from '@angular/core';

import { SelectModule } from '@app/shared/components/form/select/select.module';
import { SharedModule } from '@app/shared/shared.module';

import { ContactRegistrationAutoCommentComponent } from './auto-comment.component';

@NgModule({
  declarations: [
    ContactRegistrationAutoCommentComponent,
  ],
  exports: [
    ContactRegistrationAutoCommentComponent,
  ],
  imports: [
    SelectModule,
    SharedModule,
  ],
})
export class ContactRegistrationAutoCommentModule {}
