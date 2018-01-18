import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';

import { EditComponent } from './edit.component';

@NgModule({
  imports: [
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
