import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OperatorCardModule } from './card/operator-card.module';
import { OperatorDialogModule } from './dialog/operator-dialog.module';

import { OperatorDetailsService } from './operator-details.service';

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    OperatorCardModule,
    OperatorDialogModule,
  ],
  providers: [
    OperatorDetailsService,
  ]
})
export class OperatorDetailsModule { }
