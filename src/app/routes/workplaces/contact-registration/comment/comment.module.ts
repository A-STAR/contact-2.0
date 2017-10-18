import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../shared/shared.module';

import { CommentComponent } from './comment.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  exports: [
    CommentComponent,
  ],
  declarations: [
    CommentComponent,
  ],
})
export class CommentModule {}
