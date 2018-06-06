import { NgModule } from '@angular/core';
import { ButtonModule } from '@app/shared/components/button/button.module';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { DownloaderModule } from '@app/shared/components/downloader/downloader.module';
import { DynamicLayoutModule } from '@app/shared/components/dynamic-layout/dynamic-layout.module';
import { DialogModule } from '@app/shared/components/dialog/dialog.module';
import { GridsModule } from '@app/shared/components/grids/grids.module';

import { LetterGenerationResultComponent } from '@app/shared/mass-ops/letter-generation/result/result-dialog.component';

@NgModule({
  imports: [
    ButtonModule,
    CommonModule,
    DownloaderModule,
    DynamicLayoutModule,
    DialogModule,
    GridsModule,
    TranslateModule,
  ],
  declarations: [
    LetterGenerationResultComponent
  ],
  exports: [
    LetterGenerationResultComponent
  ],
})
export class LetterGenerationResultModule { }
