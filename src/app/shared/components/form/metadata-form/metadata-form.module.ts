import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { CheckModule } from '../check/check.module';
import { InputModule } from '../input/input.module';

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
    CheckModule,
    CommonModule,
    InputModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
})
export class MetadataFormModule {}
