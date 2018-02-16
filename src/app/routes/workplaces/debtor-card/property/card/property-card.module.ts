import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '../../../../../shared/shared.module';

import { PropertyCardComponent } from './property-card.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    SharedModule
  ],
  exports: [
    PropertyCardComponent,
  ],
  declarations: [
    PropertyCardComponent,
  ]
})
export class PropertyCardModule { }
