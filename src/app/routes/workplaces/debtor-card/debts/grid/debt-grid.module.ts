import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DebtGridDialogsModule } from './dialogs/debt-grid-dialogs.module';
import { SharedModule } from '@app/shared/shared.module';

import { DebtGridComponent } from './debt-grid.component';

@NgModule({
  imports: [
    CommonModule,
    DebtGridDialogsModule,
    SharedModule,
  ],
  exports: [
    DebtGridComponent,
  ],
  declarations: [
    DebtGridComponent,
  ],
  entryComponents: [
    DebtGridComponent,
  ]
})
export class DebtGridModule {}
