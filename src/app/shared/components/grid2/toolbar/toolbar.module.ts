import { NgModule } from '@angular/core';
import { CommonModule} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { SelectModule } from '../../form/select/select.module';
import { ToolbarComponent } from './toolbar.component';
import { ToolbarService } from './toolbar.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SelectModule,
    TranslateModule,
  ],
  exports: [
    ToolbarComponent,
  ],
  declarations: [
    ToolbarComponent,
  ],
  providers: [
    ToolbarService,
  ]
})
export class ToolbarModule { }
