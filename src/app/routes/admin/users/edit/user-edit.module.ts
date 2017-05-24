import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../shared/shared.module';
import { UserEditComponent } from './user-edit.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  exports: [
    UserEditComponent,
  ],
  declarations: [
    UserEditComponent,
  ]
})
export class UserEditModule { }
