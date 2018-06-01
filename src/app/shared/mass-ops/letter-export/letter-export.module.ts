import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DownloaderModule } from '@app/shared/components/downloader/downloader.module';

import { LetterExportComponent } from './letter-export.component';

@NgModule({
  imports: [
    CommonModule,
    DownloaderModule
  ],
  declarations: [
    LetterExportComponent
  ],
  exports: [
    LetterExportComponent
  ],
})
export class LetterExportModule { }
