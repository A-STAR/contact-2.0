import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlatContainerComponent } from './flat-container.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    FlatContainerComponent,
  ],
  declarations: [
    FlatContainerComponent,
  ]
})
export class FlatContainerModule { }
