import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AreaService } from './area.service';

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
  providers: [
    AreaService,
  ]
})
export class AreaModule {}
