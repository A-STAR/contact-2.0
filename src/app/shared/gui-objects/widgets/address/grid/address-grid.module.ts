import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GridModule } from '../../../../components/grid/grid.module';
import { Toolbar2Module } from '../../../../components/toolbar-2/toolbar-2.module';

import { AddressGridService } from './address-grid.service';

import { AddressGridComponent } from './address-grid.component';

@NgModule({
  imports: [
    CommonModule,
    GridModule,
    Toolbar2Module,
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
