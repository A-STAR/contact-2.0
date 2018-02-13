import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { CheckboxModule } from './checkbox/checkbox.module';
import { NumberModule } from './number/number.module';
import { RadioButtonModule } from './radiobutton/radiobutton.module';
import { SharedModule } from '@app/shared/shared.module';
import { TextModule } from './text/text.module';
import { TextareaModule } from './textarea/textarea.module';

import { InputsComponent } from './inputs.component';

const routes: Routes = [
  {
    path: '',
    component: InputsComponent,
  },
];

@NgModule({
  imports: [
    CheckboxModule,
    FormsModule,
    NumberModule,
    RadioButtonModule,
    RouterModule.forChild(routes),
    SharedModule,
    TextModule,
    TextareaModule,
  ],
  declarations: [
    InputsComponent,
  ],
  exports: [
    RouterModule,
  ]
})
export class InputsModule {}
