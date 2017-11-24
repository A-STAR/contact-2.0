import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '../../../../../../shared/shared.module';

import { StatusDialogComponent } from './status-dialog.component';

@NgModule({
  imports: [
    SharedModule,
    TranslateModule,
  ],
  exports: [
    StatusDialogComponent,
  ],
  declarations: [
    StatusDialogComponent,
  ],
})
export class StatusDialogModule { }
