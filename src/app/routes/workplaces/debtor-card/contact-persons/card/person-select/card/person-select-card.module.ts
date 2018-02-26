import { NgModule } from '@angular/core';

import { PersonSelectCardComponent } from './person-select-card.component';
import { SharedModule } from '@app/shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
  ],
  exports: [
    PersonSelectCardComponent,
  ],
  declarations: [
    PersonSelectCardComponent,
  ],
})
export class PersonSelectCardModule { }
