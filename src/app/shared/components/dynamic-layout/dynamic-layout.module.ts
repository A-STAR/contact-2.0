import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DynamicLayoutService } from './dynamic-layout.service';

import { DynamicLayoutComponent } from './dynamic-layout.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    DynamicLayoutComponent,
  ],
  declarations: [
    DynamicLayoutComponent,
  ],
  providers: [
    DynamicLayoutService,
  ],
})
export class DynamicLayoutModule {}
