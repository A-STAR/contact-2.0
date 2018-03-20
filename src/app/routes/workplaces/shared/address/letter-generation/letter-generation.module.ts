import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';

import { LetterGenerationDialogComponent } from './letter-generation.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  exports: [
    LetterGenerationDialogComponent
  ],
  declarations: [
    LetterGenerationDialogComponent
  ],
})
export class LetterGenerationModule { }
