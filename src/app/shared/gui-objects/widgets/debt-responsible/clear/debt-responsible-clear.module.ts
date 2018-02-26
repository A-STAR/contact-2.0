import { NgModule } from '@angular/core';

import { DialogActionModule } from '@app/shared/components/dialog-action/dialog-action.module';

import { DebtResponsibleClearComponent } from './debt-responsible-clear.component';

@NgModule({
  imports: [
    DialogActionModule,
  ],
  declarations: [
    DebtResponsibleClearComponent,
  ],
  exports: [
    DebtResponsibleClearComponent,
  ],
})
export class DebtResponsibleClearModule { }
