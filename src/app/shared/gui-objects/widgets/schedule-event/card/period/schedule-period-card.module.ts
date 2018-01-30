import { NgModule } from '@angular/core';
import { ButtonModule } from '../../../../../components/button/button.module';
import { CommonModule } from '@angular/common';
import { GridModule } from '../../../../../components/grid/grid.module';
import { TranslateModule } from '@ngx-translate/core';

import { DynamicFormModule } from '../../../../../components/form/dynamic-form/dynamic-form.module';

import { SchedulePeriodCardComponent } from './schedule-period-card.component';

@NgModule({
  imports: [
    ButtonModule,
    CommonModule,
    GridModule,
    TranslateModule,
    DynamicFormModule
  ],
  exports: [
    SchedulePeriodCardComponent,
  ],
  declarations: [
    SchedulePeriodCardComponent,
  ],
  entryComponents: [
    SchedulePeriodCardComponent,
  ]
})
export class SchedulePeriodCardModule { }
