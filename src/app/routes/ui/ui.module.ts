import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { CheckboxModule } from './checkbox/checkbox.module';
import { DatePickerModule } from './datepicker/datepicker.module';
import { DateTimePickerModule } from './datetimepicker/datetimepicker.module';
import { GridsModule } from './grids/grids.module';
import { IconsModule } from '@app/routes/ui/icons/icons.module';
import { NumberModule } from './number/number.module';
import { RadioButtonModule } from './radiobutton/radiobutton.module';
import { SharedModule } from '@app/shared/shared.module';
import { TextModule } from './text/text.module';
import { TextareaModule } from './textarea/textarea.module';
import { TimePickerModule } from './timepicker/timepicker.module';

import { UIComponent } from './ui.component';

const routes: Routes = [
  {
    path: '',
    component: UIComponent,
  },
];

@NgModule({
  imports: [
    CheckboxModule,
    DatePickerModule,
    DateTimePickerModule,
    FormsModule,
    GridsModule,
    IconsModule,
    NumberModule,
    RadioButtonModule,
    RouterModule.forChild(routes),
    SharedModule,
    TextModule,
    TextareaModule,
    TimePickerModule,
  ],
  exports: [
    RouterModule,
  ],
  declarations: [
    UIComponent,
  ],
})
export class UIModule {}
