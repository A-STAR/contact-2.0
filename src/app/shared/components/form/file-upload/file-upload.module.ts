import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { FileUploadComponent } from './file-upload.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
  ],
  exports: [
    FileUploadComponent,
  ],
  declarations: [
    FileUploadComponent,
  ],
  providers: [],
})
export class FileUploadModule { }
