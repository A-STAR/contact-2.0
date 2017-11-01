import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GridModule } from '../../../../../../shared/components/grid/grid.module';
import { SharedModule } from '../../../../../../shared/shared.module';

import { PhoneGridComponent } from './phone.component';

@NgModule({
  imports: [
    CommonModule,
    GridModule,
    SharedModule,
  ],
  exports: [
    PhoneGridComponent,
  ],
  declarations: [
    PhoneGridComponent
  ]
})
export class PhoneGridModule { }
