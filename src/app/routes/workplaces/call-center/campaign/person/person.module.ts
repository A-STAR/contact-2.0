import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../shared/shared.module';

import { PersonComponent } from './person.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  exports: [
    PersonComponent,
  ],
  declarations: [
    PersonComponent,
  ],
})
export class PersonModule {}
