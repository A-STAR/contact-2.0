import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DialogActionModule } from '../../../../components/dialog-action/dialog-action.module';
import { Toolbar2Module } from '../../../../components/toolbar-2/toolbar-2.module';

import { ContactPropertyTreeComponent } from './contact-property-tree.component';

@NgModule({
  imports: [
    CommonModule,
    DialogActionModule,
    Toolbar2Module,
  ],
  exports: [
    ContactPropertyTreeComponent,
  ],
  declarations: [
    ContactPropertyTreeComponent,
  ],
  entryComponents: [
    ContactPropertyTreeComponent,
  ]
})
export class ContactPropertyTreeModule { }
