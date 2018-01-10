import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PersonSelectGridModule } from './grid/person-select-grid.module';
import { PersonSelectCardModule } from './card/person-select-card.module';

import { PersonSelectService } from './person-select.service';

@NgModule({
  imports: [
    PersonSelectGridModule,
    PersonSelectCardModule,
    CommonModule,
  ],
  exports: [
    PersonSelectService,
  ],
  providers: [
    PersonSelectService,
  ]
})
export class PersonSelectModule { }
