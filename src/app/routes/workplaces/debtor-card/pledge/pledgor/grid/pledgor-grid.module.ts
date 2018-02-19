import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '@app/shared/shared.module';

import { PledgorGridComponent } from './pledgor-grid.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    SharedModule
  ],
  exports: [
    PledgorGridComponent,
  ],
  declarations: [
    PledgorGridComponent,
  ],
  entryComponents: [
    PledgorGridComponent,
  ]
})
export class PledgorGridModule { }
