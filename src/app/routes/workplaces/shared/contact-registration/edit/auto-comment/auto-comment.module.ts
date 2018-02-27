import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';

import { ContactRegistrationAutoCommentComponent } from './auto-comment.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [
    ContactRegistrationAutoCommentComponent,
  ],
  exports: [
    ContactRegistrationAutoCommentComponent,
  ],
})
export class ContactRegistrationAutoCommentModule {}
