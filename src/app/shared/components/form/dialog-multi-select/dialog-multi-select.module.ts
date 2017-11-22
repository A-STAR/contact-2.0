import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { ButtonModule } from '../../button/button.module';
import { DialogModule } from '../../dialog/dialog.module';
import { GridModule } from '../../grid/grid.module';

import { DialogMultiSelectComponent } from './dialog-multi-select.component';
import { DialogMultiSelectWrapperComponent } from './dialog-multi-select-wrapper.component';

@NgModule({
  imports: [
    ButtonModule,
    CommonModule,
    DialogModule,
    FormsModule,
    GridModule,
    TranslateModule,
  ],
  exports: [
    DialogMultiSelectComponent,
    DialogMultiSelectWrapperComponent,
  ],
  declarations: [
    DialogMultiSelectComponent,
    DialogMultiSelectWrapperComponent,
  ],
})
export class DialogMultiSelectModule { }
