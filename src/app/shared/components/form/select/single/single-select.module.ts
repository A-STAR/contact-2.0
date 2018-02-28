import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { AlignmentDirective } from '@app/shared/directives/alignment/alignment.directive';
import { DropdownModule } from '../../../dropdown/dropdown.module';
import { ListModule } from '../../../list/list.module';

import { SelectComponent } from './select.component';

@NgModule({
  imports: [
    CommonModule,
    DropdownModule,
    FormsModule,
    ListModule,
    TranslateModule,
  ],
  exports: [
    SelectComponent,
  ],
  declarations: [
    AlignmentDirective,
    SelectComponent,
  ],
})
export class SingleSelectModule { }
