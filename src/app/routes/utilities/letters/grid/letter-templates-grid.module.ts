import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';

import { LetterTemplatesGridComponent } from './letter-templates-grid.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  exports: [
    LetterTemplatesGridComponent,
  ],
  declarations: [
    LetterTemplatesGridComponent,
  ]
})
export class LetterTemplatesGridModule { }
