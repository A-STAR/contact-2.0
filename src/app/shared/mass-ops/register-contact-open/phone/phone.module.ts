import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { ButtonModule } from '@app/shared/components/button/button.module';
import { GridsModule } from '@app/shared/components/grids/grids.module';

import { PhoneService } from '@app/routes/workplaces/core/phone/phone.service';

import { PhoneGridComponent } from './phone.component';

@NgModule({
  imports: [
    CommonModule,
    ButtonModule,
    GridsModule,
    TranslateModule,
  ],
   // TODO(i.lobanov): we have to import this service explicitly,
  // because of circular dependency.
  // NOTE: it will have its own instance here.
  providers: [ PhoneService ],
  exports: [
    PhoneGridComponent,
  ],
  declarations: [
    PhoneGridComponent
  ]
})
export class PhoneGridModule {}
