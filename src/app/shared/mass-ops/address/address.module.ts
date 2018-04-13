import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { DialogModule } from '@app/shared/components/dialog/dialog.module';
import { MapModule } from '@app/shared/components/map/map.module';

import { AddressService } from './address.service';

import { AddressDialogComponent } from './dialog/address-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    DialogModule,
    MapModule,
    TranslateModule,
  ],
  providers: [
    AddressService
  ],
  declarations: [ AddressDialogComponent ],
  exports: [ AddressDialogComponent ]
})
export class AddressModule { }
