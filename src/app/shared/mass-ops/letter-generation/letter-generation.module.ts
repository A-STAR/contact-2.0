import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { ButtonModule } from '@app/shared/components/button/button.module';
import { DialogModule } from '@app/shared/components/dialog/dialog.module';
import { DynamicLayoutModule } from '@app/shared/components/dynamic-layout/dynamic-layout.module';

import { LetterGenerationService } from './letter-generation.service';

import { LetterGenerationComponent } from './letter-generation.component';

@NgModule({
  imports: [
    ButtonModule,
    CommonModule,
    DialogModule,
    DynamicLayoutModule,
    TranslateModule,
  ],
  exports: [
    LetterGenerationComponent,
  ],
  declarations: [
    LetterGenerationComponent,
  ],
  providers: [
    LetterGenerationService
  ],
})
export class LetterGenerationModule {}
