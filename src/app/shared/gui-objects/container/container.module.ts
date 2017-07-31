import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { TabstripModule } from '../../components/tabstrip/tabstrip.module';

import { ContainerComponent } from './container.component';

@NgModule({
  imports: [
    CommonModule,
    TabstripModule,
    TranslateModule,
  ],
  exports: [
    ContainerComponent,
  ],
  declarations: [
    ContainerComponent,
  ]
})
export class ContainerModule { }
