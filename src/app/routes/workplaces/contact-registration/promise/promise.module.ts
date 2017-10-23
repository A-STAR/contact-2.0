import { NgModule } from '@angular/core';
import { TreeTableModule } from 'primeng/primeng';

import { DialogModule } from '../../../../shared/components/dialog/dialog.module';
import { SharedModule } from '../../../../shared/shared.module';

import { PromiseComponent } from './promise.component';

@NgModule({
  imports: [
    DialogModule,
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
