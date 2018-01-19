import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { DynamicFormModule } from '../../../../../components/form/dynamic-form/dynamic-form.module';
import { GridModule } from '../../../../../components/grid/grid.module';

import { ScheduleTypeCardComponent } from './schedule-type-card.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    DynamicFormModule,
    GridModule,
  ],
  exports: [
    ScheduleTypeCardComponent,
  ],
  declarations: [
    ScheduleTypeCardComponent,
  ],
  entryComponents: [
    ScheduleTypeCardComponent,
  ]
})
export class ScheduleTypeCardModule { }
