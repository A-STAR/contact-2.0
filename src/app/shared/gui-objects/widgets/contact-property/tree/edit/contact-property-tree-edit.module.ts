import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { DialogModule } from '../../../../../components/dialog/dialog.module';
import { DynamicFormModule } from '../../../../../components/form/dynamic-form/dynamic-form.module';
import { TabstripModule } from '../../../../../components/tabstrip/tabstrip.module';

import { ContactPropertyTreeEditComponent } from './contact-property-tree-edit.component';

@NgModule({
  imports: [
    CommonModule,
    DialogModule,
    DynamicFormModule,
    TabstripModule,
    TranslateModule,
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
