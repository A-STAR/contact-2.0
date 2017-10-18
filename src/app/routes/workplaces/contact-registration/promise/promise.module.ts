import { NgModule } from '@angular/core';
import { TreeTableModule } from 'primeng/primeng';

import { SharedModule } from '../../../../shared/shared.module';

import { PromiseComponent } from './promise.component';

@NgModule({
  imports: [
    SharedModule,
    TreeTableModule,
  ],
  exports: [
    PromiseComponent,
  ],
  declarations: [
    PromiseComponent,
  ],
})
export class PromiseModule {}
