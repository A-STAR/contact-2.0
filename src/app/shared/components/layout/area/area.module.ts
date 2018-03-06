import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AreaComponent } from './area.component';

@NgModule({
  declarations: [
    AreaComponent,
  ],
  exports: [
    AreaComponent,
  ],
  imports: [
    CommonModule,
  ],
})
export class AreaModule {}
