import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';

import { UserGridComponent } from './user-grid.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [
    UserGridComponent
  ],
  exports: [
    UserGridComponent
  ],
})
export class UserGridModule { }
