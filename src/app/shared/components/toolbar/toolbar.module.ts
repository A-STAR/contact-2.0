import { NgModule } from '@angular/core';
import { CommonModule} from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';
import { ToolbarComponent } from './toolbar.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule
  ],
  exports: [
    ToolbarComponent,
  ],
  declarations: [
    ToolbarComponent,
  ]
})
export class ToolbarModule { }
