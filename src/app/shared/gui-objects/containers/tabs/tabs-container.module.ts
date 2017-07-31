import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TabsContainerComponent } from './tabs-container.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    TabsContainerComponent,
  ],
  declarations: [
    TabsContainerComponent,
  ]
})
export class TabsContainerModule { }
