import { NgModule } from '@angular/core';

import { DebtsModule } from './debts/debts.module';
import { PromiseModule } from './promise/promise.module';

@NgModule({
  imports: [
    DebtsModule,
    PromiseModule,
  ],
})
export class WorkplacesCoreModule {}
