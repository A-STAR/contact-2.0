import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';

import { LetterGenerationDialogComponent } from './letter-generation.component';

import { LetterGenerationService } from '@app/routes/workplaces/shared/address/letter-generation/letter-generation.service';

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
  providers: [
    LetterGenerationService
  ]
})
export class LetterGenerationModule { }
