import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DownloaderModule } from '../downloader/downloader.module';
import { GridModule } from '../grid/grid.module';
import { Toolbar2Module } from '../toolbar-2/toolbar-2.module';

import { AttachmentsComponent } from './attachments.component';

@NgModule({
  imports: [
    CommonModule,
    DownloaderModule,
    GridModule,
    Toolbar2Module,
  ],
  exports: [
    AttachmentsComponent,
  ],
  declarations: [
    AttachmentsComponent,
  ],
  providers: [],
})
export class AttachmentsModule { }
