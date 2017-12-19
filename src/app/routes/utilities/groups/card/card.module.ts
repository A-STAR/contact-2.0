import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../shared/shared.module';

import { GroupCardComponent } from './card.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  exports: [
    GroupCardComponent
  ],
  declarations: [
    GroupCardComponent
  ],
})
export class GroupCardModule {}
