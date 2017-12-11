import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../shared/shared.module';

import { DebtorGridService } from './debtor-grid.service';

import { DebtorGridComponent } from './debtor-grid.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [
    DebtorGridComponent,
  ],
  exports: [
    DebtorGridComponent,
  ],
  providers: [
    DebtorGridService,
    // TODO(d.maltsev, i.kibisov): get `entityTypeId` from grid metadata instead
    { provide: 'entityTypeId', useValue: 19 },
    { provide: 'manualGroup', useValue: true },
  ]
})
export class DebtorGridModule {}
