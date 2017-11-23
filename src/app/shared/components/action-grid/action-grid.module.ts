import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContactLogModule } from '../../gui-objects/widgets/contact-log/contact-log.module';
import { EntityGroupModule } from '../../gui-objects/widgets/entity-group/entity-group.module';
import { DebtResponsibleModule } from '../../gui-objects/widgets/debt-responsible/debt-responsible.module';
import { PromiseResolveModule } from '../../gui-objects/widgets/promise-resolve/promise-resolve.module';
import { PaymentsChangesModule } from '../../gui-objects/widgets/payments-changes/payments-changes.module';
import { Grid2Module } from '../grid2/grid2.module';

import { ActionGridComponent } from './action-grid.component';

@NgModule({
  imports: [
    CommonModule,
    ContactLogModule,
    DebtResponsibleModule,
    PromiseResolveModule,
    PaymentsChangesModule,
    EntityGroupModule,
    Grid2Module,
  ],
  exports: [
    ActionGridComponent,
  ],
  declarations: [
    ActionGridComponent,
  ]
})
export class ActionGridModule { }
