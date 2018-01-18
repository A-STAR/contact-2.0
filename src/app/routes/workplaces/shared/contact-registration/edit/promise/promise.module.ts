import { NgModule } from '@angular/core';
import { TreeTableModule } from 'primeng/primeng';

import { DialogModule } from '@app/shared/components/dialog/dialog.module';
import { SharedModule } from '@app/shared/shared.module';

import { PromiseService  } from './promise.service';

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
  providers: [
    PromiseService,
  ]
})
export class PromiseModule {}
