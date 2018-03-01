import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { ButtonModule } from '@app/shared/components/button/button.module';
import { GridsModule } from '@app/shared/components/grids/grids.module';

import { AddressService } from '@app/routes/workplaces/shared/address/address.service';

import { AddressGridComponent } from './address.component';

@NgModule({
  imports: [
    CommonModule,
    ButtonModule,
    GridsModule,
    TranslateModule,
  ],
  exports: [
    AddressGridComponent,
  ],
  // TODO(i.lobanov): we have to import this service explicitly,
  // because of circular dependency.
  // NOTE: it will have its own instance here.
  providers: [ AddressService ],
  declarations: [
    AddressGridComponent
  ],
})
export class AddressGridModule {}
