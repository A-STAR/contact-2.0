import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { DynamicFormModule } from '../../../../components/form/dynamic-form/dynamic-form.module';
import { ContainerModule } from '../../../container/container.module';
import { ContactCardComponent } from './contact-card.component';

@NgModule({
  imports: [
    CommonModule,
    ContainerModule,
    DynamicFormModule,
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
