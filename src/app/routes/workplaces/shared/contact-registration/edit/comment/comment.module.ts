import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';

import { ContactRegistrationCommentComponent } from './comment.component';

@NgModule({
  declarations: [
    ContactRegistrationCommentComponent,
  ],
  exports: [
    ContactRegistrationCommentComponent,
  ],
  imports: [
    SharedModule,
  ]
})
export class ContactRegistrationCommentModule {}
