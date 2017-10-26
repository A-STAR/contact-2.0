import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { DialogModule } from '../../../../../components/dialog/dialog.module';

import { AddressGridVisitsComponent } from './visits.component';

@NgModule({
  imports: [
    CommonModule,
    DialogModule,
    TranslateModule,
  ],
  exports: [
    AddressGridVisitsComponent,
  ],
  declarations: [
    AddressGridVisitsComponent,
  ],
  entryComponents: [
    AddressGridVisitsComponent,
  ]
})
export class AddressGridVisitsModule { }
