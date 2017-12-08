import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GridModule } from '../../../../../shared/components/grid/grid.module';
import { SharedModule } from '../../../../../shared/shared.module';

import { AddressGridComponent } from './address.component';

@NgModule({
  imports: [
    CommonModule,
    GridModule,
    SharedModule,
  ],
  exports: [
    AddressGridComponent,
  ],
  declarations: [
    AddressGridComponent
  ],
  entryComponents: [
    AddressGridComponent,
  ]
})
export class AddressGridModule { }
