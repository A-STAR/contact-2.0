import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GridModule } from '../../../../../../shared/components/grid/grid.module';

import { AddressGridComponent } from './address.component';

@NgModule({
  imports: [
    CommonModule,
    GridModule,
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
