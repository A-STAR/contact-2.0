import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Toolbar2Module } from '@app/shared/components/toolbar-2/toolbar-2.module';

import { MapToolbarComponent } from './map-toolbar.component';

@NgModule({
  imports: [
    CommonModule,
    Toolbar2Module,
  ],
  declarations: [ MapToolbarComponent ],
  exports: [ MapToolbarComponent ],
  entryComponents: [ MapToolbarComponent ]
})
export class MapToolbarModule { }
