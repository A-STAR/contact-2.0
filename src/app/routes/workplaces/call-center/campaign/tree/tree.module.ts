import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../../shared/shared.module';

import { TreeComponent } from './tree.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  exports: [
    TreeComponent,
  ],
  declarations: [
    TreeComponent,
  ],
})
export class TreeModule {}
