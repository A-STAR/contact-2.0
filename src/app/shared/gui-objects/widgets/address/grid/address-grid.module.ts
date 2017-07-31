import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GridModule } from '../../../../components/grid/grid.module';

import { AddressGridService } from './address-grid.service';

import { AddressGridComponent } from './address-grid.component';

@NgModule({
  imports: [
    CommonModule,
    GridModule,
  ],
  exports: [
    AddressGridComponent,
  ],
  declarations: [
    AddressGridComponent,
  ],
  providers: [
    AddressGridService,
  ],
  entryComponents: [
    AddressGridComponent,
  ]
})
export class AddressGridModule { }
