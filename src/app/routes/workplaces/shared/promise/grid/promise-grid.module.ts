import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';

import { PromiseGridComponent } from './promise-grid.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  exports: [
    PromiseGridComponent,
  ],
  declarations: [
    PromiseGridComponent,
  ]
})
export class PromiseGridModule {}
