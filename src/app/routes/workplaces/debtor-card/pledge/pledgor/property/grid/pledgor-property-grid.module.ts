import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '@app/shared/shared.module';

import { PledgorPropertyGridComponent } from './pledgor-property-grid.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    SharedModule
  ],
  exports: [
    PledgorPropertyGridComponent,
  ],
  declarations: [
    PledgorPropertyGridComponent,
  ],
  entryComponents: [
    PledgorPropertyGridComponent,
  ]
})
export class PledgorPropertyGridModule { }
