import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DebtorPropertyAttributesModule } from './attributes/property-attributes.module';
import { PropertyGridModule } from './grid/property-grid.module';
import { SharedModule } from '@app/shared/shared.module';

import { PropertyComponent } from './property.component';

@NgModule({
  imports: [
    CommonModule,
    DebtorPropertyAttributesModule,
    PropertyGridModule,
    SharedModule,
  ],
  declarations: [ PropertyComponent ],
  exports: [ PropertyComponent ],
})
export class PropertyModule { }
