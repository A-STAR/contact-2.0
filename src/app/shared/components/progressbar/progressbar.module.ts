import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProgressbarComponent } from './progressbar.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    ProgressbarComponent,
  ],
  declarations: [
    ProgressbarComponent,
  ],
  providers: [],
})
export class ProgressbarModule { }
