import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { ContainerModule } from '../../../container/container.module';
import { ContactCardComponent } from './contact-card.component';
import { DynamicFormModule } from '../../../../components/form/dynamic-form/dynamic-form.module';
import { PhoneGridModule } from './phone-grid/phone-grid.module';

@NgModule({
  imports: [
    CommonModule,
    ContainerModule,
    DynamicFormModule,
    PhoneGridModule,
    TranslateModule,
  ],
  exports: [
    ContactCardComponent,
  ],
  declarations: [
    ContactCardComponent,
  ],
  entryComponents: [
    ContactCardComponent,
  ]
})
export class ContactCardModule { }
