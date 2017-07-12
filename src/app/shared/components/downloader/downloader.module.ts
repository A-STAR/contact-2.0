import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DownloaderComponent } from './downloader.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    DownloaderComponent,
  ],
  declarations: [
    DownloaderComponent,
  ],
  providers: [],
})
export class DownloaderModule { }
