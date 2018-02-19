import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { ButtonModule } from '@app/shared/components/button/button.module';
import { CheckModule } from '@app/shared/components/form/check/check.module';
import { DialogModule } from '@app/shared/components/dialog/dialog.module';
import { DynamicFormModule } from '@app/shared/components/form/dynamic-form/dynamic-form.module';
import { GridsModule } from '@app/shared/components/grids/grids.module';
import { GridTree2WrapperModule } from '@app/shared/components/gridtree2-wrapper/gridtree2-wrapper.module';
import { TabViewModule } from '@app/shared/components/layout/tabview/tabview.module';

import { ContactPropertyTreeEditComponent } from './contact-property-tree-edit.component';

@NgModule({
  imports: [
    ButtonModule,
    CheckModule,
    CommonModule,
    DialogModule,
    DynamicFormModule,
    FormsModule,
    GridsModule,
    GridTree2WrapperModule,
    TabViewModule,
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
export class ContactPropertyTreeEditModule {}
