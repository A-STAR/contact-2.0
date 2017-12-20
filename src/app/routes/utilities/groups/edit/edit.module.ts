import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../shared/shared.module';

import { GroupEditComponent } from './edit.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  exports: [
    GroupEditComponent
  ],
  declarations: [
    GroupEditComponent
  ],
})
export class GroupEditModule {}
