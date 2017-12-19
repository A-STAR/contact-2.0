import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NextCallDateSetDialogModule } from './dialog/next-call-date-set.dialog.module';


import { NextCallDateSetService } from './next-call-date-set.service';

@NgModule({
  imports: [
    NextCallDateSetDialogModule,
    CommonModule,
  ],
  exports: [
    NextCallDateSetDialogModule,
  ],
  providers: [
    NextCallDateSetService,
  ]
})
export class NextCallDateSetModule { }
