import { NgModule } from '@angular/core';
import { CommonModule} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { ActionDialogModule } from '../../../dialog/action/action-dialog.module';
import { SelectModule } from '../../../form/select/select.module';
import { Grid2ColumnFilterComponent } from './grid2-column-filter.component';
import { DynamicFormModule } from '../../../form/dynamic-form/dynamic-form.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    ActionDialogModule,
    SelectModule,
    FormsModule,
    DynamicFormModule,
  ],
  exports: [
    Grid2ColumnFilterComponent,
  ],
  declarations: [
    Grid2ColumnFilterComponent,
  ],
})
export class Grid2ColumnFilterModule {
}

