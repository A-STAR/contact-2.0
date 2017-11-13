import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DebtGroupAddModule } from './dialog/add/debt-group-add.module';

import { DebtGroupService } from './debt-group.service';

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    DebtGroupAddModule,
  ],
  providers: [
    DebtGroupService,
  ]
})
export class DebtGroupModule { }
