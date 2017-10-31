import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GridModule } from '../../../../../../shared/components/grid/grid.module';

import { PhoneGridComponent } from './phone.component';

@NgModule({
  imports: [
    CommonModule,
    GridModule,
  ],
  exports: [
    PhoneGridComponent,
  ],
  declarations: [
    PhoneGridComponent
  ],
  entryComponents: [
    PhoneGridComponent,
  ]
})
export class PhoneGridModule { }
