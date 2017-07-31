import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContainersModule } from './containers/containers.module';
import { WidgetsModule } from './widgets/widgets.module';

@NgModule({
  imports: [
    CommonModule,
    ContainersModule,
    WidgetsModule,
  ],
  exports: [
    ContainersModule,
    WidgetsModule,
  ]
})
export class GuiObjectsModule { }
