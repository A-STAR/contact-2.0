import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { DialogModule } from '@app/shared/components/dialog/dialog.module';
import { DictionaryModule } from '@app/shared/pipes/dictionary/dictionary.module';
import { MapModule } from '@app/shared/components/map/map.module';
import { MomentModule } from '@app/shared/pipes/moment/moment.module';

import { AddressService } from './address.service';

import { AddressComponent } from './address/address.component';
import { ContactComponent } from './contact/contact.component';

@NgModule({
  imports: [
    CommonModule,
    DialogModule,
    DictionaryModule,
    MapModule,
    MomentModule,
    TranslateModule,
  ],
  providers: [
    AddressService
  ],
  declarations: [ AddressComponent, ContactComponent ],
  exports: [ AddressComponent, ContactComponent ]
})
export class AddressModule { }
