import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { DropdownModule } from '@app/shared/components/dropdown/dropdown.module';

import { MultiLanguageComponent } from './multilanguage.component';

@NgModule({
  imports: [
    CommonModule,
    DropdownModule,
    FormsModule,
    TranslateModule,
  ],
  exports: [
    MultiLanguageComponent,
  ],
  declarations: [
    MultiLanguageComponent,
  ],
})
export class MultiLanguageModule {}
