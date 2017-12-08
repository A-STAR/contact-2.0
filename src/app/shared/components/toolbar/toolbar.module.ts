import { NgModule } from '@angular/core';
import { CommonModule} from '@angular/common';

import { SelectModule } from '../form/select/select.module';

import { TranslateModule } from '@ngx-translate/core';
import { ToolbarComponent } from './toolbar.component';
import { ToolbarService } from './toolbar.service';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    SelectModule,
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
