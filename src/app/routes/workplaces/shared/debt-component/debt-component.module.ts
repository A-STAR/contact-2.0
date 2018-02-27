import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';

import { DebtComponentService } from './debt-component.service';

import { DebtComponentCardComponent } from './card/debt-component-card.component';
import { DebtComponentGridComponent } from './grid/debt-component-grid.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  exports: [
    DebtComponentCardComponent,
    DebtComponentGridComponent,
  ],
  declarations: [
    DebtComponentCardComponent,
    DebtComponentGridComponent,
  ],
  providers: [
    DebtComponentService,
  ]
})
export class DebtComponentModule {}
