import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { ButtonModule } from '../../button/button.module';
import { DialogModule } from '../../dialog/dialog.module';
import { GridModule } from '../../grid/grid.module';

import { DialogMultiSelectService } from './dialog-multi-select.service';

import { DialogMultiSelectComponent } from './dialog-multi-select.component';

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
  ],
  declarations: [
    DialogMultiSelectComponent,
  ],
  providers: [
    DialogMultiSelectService,
  ]
})
export class DialogMultiSelectModule { }
