import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { ImageUploadComponent } from './image-upload.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
  ],
  exports: [
    ImageUploadComponent,
  ],
  declarations: [
    ImageUploadComponent,
  ],
  providers: [],
})
export class ImageUploadModule { }
