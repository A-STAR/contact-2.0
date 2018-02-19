import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '@app/shared/shared.module';
import { PledgorPropertyGridModule } from '../grid/pledgor-property-grid.module';

import { PledgorPropertyCardComponent } from './pledgor-property-card.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    TranslateModule,
    PledgorPropertyGridModule,
  ],
  exports: [
    PledgorPropertyCardComponent,
  ],
  declarations: [
    PledgorPropertyCardComponent,
  ],
  entryComponents: [
    PledgorPropertyCardComponent,
  ]
})
export class PledgorPropertyCardModule { }
