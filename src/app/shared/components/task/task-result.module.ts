import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LetterGenerationResultModule } from '@app/shared/mass-ops/letter-generation/result/result-dialog.module';

import { TaskResultComponent } from './task-result.component';

@NgModule({
  imports: [
    CommonModule,
    LetterGenerationResultModule
  ],
  exports: [
    TaskResultComponent,
  ],
  declarations: [
    TaskResultComponent,
  ],
})
export class TaskResultModule {}
