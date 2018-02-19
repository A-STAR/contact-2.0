import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '@app/shared/shared.module';
import { PledgorGridModule } from '../grid/pledgor-grid.module';

import { PledgorCardComponent } from './pledgor-card.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    TranslateModule,
    PledgorGridModule,
  ],
  exports: [
    PledgorCardComponent,
  ],
  declarations: [
    PledgorCardComponent,
  ],
  entryComponents: [
    PledgorCardComponent,
  ]
})
export class PledgorCardModule { }
