import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { AttributeCardComponent } from './attribute-card.component';
import { DynamicFormModule } from '../../../../components/form/dynamic-form/dynamic-form.module';
import { ContainerModule } from '../../../container/container.module';

@NgModule({
  imports: [
    CommonModule,
    ContainerModule,
    DynamicFormModule,
    TranslateModule,
  ],
  exports: [
    AttributeCardComponent,
  ],
  declarations: [
    AttributeCardComponent,
  ],
  entryComponents: [
    AttributeCardComponent,
  ]
})
export class AttributeCardModule { }
