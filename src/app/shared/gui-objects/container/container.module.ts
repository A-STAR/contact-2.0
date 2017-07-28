import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContainerComponent } from './container.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    ContainerComponent,
  ],
  declarations: [
    ContainerComponent,
  ]
})
export class ContainerModule { }
