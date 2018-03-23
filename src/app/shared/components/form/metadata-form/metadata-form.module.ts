import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { InputModule } from '../input/input.module';
import { PasswordModule } from '../password/password.module';

import { MetadataFormComponent } from './metadata-form.component';
import { MetadataFormGroupComponent } from './group/metadata-form-group.component';

@NgModule({
  declarations: [
    MetadataFormComponent,
    MetadataFormGroupComponent,
  ],
  exports: [
    MetadataFormComponent,
  ],
  imports: [
    CommonModule,
    InputModule,
    PasswordModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
})
export class MetadataFormModule {}
