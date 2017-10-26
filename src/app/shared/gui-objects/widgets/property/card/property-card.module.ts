import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { DynamicFormModule } from '../../../../components/form/dynamic-form/dynamic-form.module';

import { PropertyCardComponent } from './property-card.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    DynamicFormModule
  ],
  exports: [
    PropertyCardComponent,
  ],
  declarations: [
    PropertyCardComponent,
  ],
  entryComponents: [
    PropertyCardComponent,
  ]
})
export class PropertyCardModule { }
