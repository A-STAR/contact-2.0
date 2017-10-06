import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { TreeTableModule } from 'primeng/primeng';

import { DialogModule } from '../../../../../components/dialog/dialog.module';
import { DynamicFormModule } from '../../../../../components/form/dynamic-form/dynamic-form.module';
import { TabstripModule } from '../../../../../components/tabstrip/tabstrip.module';

import { ContactPropertyTreeEditComponent } from './contact-property-tree-edit.component';

@NgModule({
  imports: [
    CommonModule,
    DialogModule,
    DynamicFormModule,
    FormsModule,
    TabstripModule,
    TranslateModule,
    TreeTableModule,
  ],
  exports: [
    ContactPropertyTreeEditComponent,
  ],
  declarations: [
    ContactPropertyTreeEditComponent,
  ],
  entryComponents: [
    ContactPropertyTreeEditComponent,
  ]
})
export class ContactPropertyTreeEditModule { }
