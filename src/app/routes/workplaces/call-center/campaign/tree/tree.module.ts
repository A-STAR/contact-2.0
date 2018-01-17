import { NgModule } from '@angular/core';
import { AngularSplitModule } from 'angular-split';

import { SharedModule } from '../../../../../shared/shared.module';

import { TreeComponent } from './tree.component';

@NgModule({
  imports: [
    AngularSplitModule,
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
