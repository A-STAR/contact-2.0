import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { DialogActionModule } from '../../../../components/dialog-action/dialog-action.module';
import { SelectModule } from '../../../../components/form/select/select.module';
import { Toolbar2Module } from '../../../../components/toolbar-2/toolbar-2.module';
import { TreeModule } from '../../../../components/flowtree/tree.module';

import { ContactPropertyTreeComponent } from './contact-property-tree.component';

@NgModule({
  imports: [
    CommonModule,
    DialogActionModule,
    FormsModule,
    SelectModule,
    Toolbar2Module,
    TranslateModule,
    TreeModule,
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
