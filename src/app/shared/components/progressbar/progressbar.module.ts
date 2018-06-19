import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProgressBarService } from './progressbar.service';

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
  providers: [
    ProgressBarService
  ],
})
export class ProgressbarModule { }
