import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../../shared/shared.module';

import { ToolbarComponent } from './toolbar.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  exports: [
    ToolbarComponent,
  ],
  declarations: [
    ToolbarComponent,
  ],
})
export class ToolbarModule { }
