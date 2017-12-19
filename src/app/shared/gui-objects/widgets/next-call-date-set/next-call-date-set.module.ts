import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';


// import { DialogActionModule } from '../../../components/dialog-action/dialog-action.module';
import { DialogModule } from '../../../components/dialog/dialog.module';
import { DynamicFormModule } from '../../../components/form/dynamic-form/dynamic-form.module';
import { NextCallDateSetDialogComponent } from './next-call-date-set.component';

// import { NextCallDateSetDialogModule } from './dialog/next-call-date-set.dialog.module';


import { NextCallDateSetService } from './next-call-date-set.service';

@NgModule({
  imports: [
    DialogModule,
    DynamicFormModule,
    CommonModule,
    TranslateModule
  ],
  exports: [
    NextCallDateSetDialogComponent,
  ],
  declarations: [
    NextCallDateSetDialogComponent
  ],
  providers: [
    NextCallDateSetService,
  ]
})
export class NextCallDateSetModule { }
