import { NgModule } from '@angular/core';
import { CommonModule} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { SelectModule } from '../../form/select/select.module';

import { PaginationComponent } from './pagination.component';
import { PaginationService } from './pagination.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SelectModule,
    TranslateModule,
  ],
  exports: [
    PaginationComponent,
  ],
  declarations: [
    PaginationComponent,
  ],
  providers: [
    PaginationService,
  ]
})
export class PaginationModule { }
