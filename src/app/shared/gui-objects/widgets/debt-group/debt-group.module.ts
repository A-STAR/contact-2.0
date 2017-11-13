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
    { provide: 'entityTypeId', useValue: DebtGroupService.ENTITY_TYPE_DEBT },
    { provide: 'manualGroup', useValue: DebtGroupService.MANUAL_GROUP }
  ]
})
export class DebtGroupModule { }
