import { NgModule } from '@angular/core';

import { PropertySearchService } from './property-search.service';
import { SharedModule } from '@app/shared/shared.module';

import { PropertySearchComponent } from './property-search.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [
    PropertySearchComponent,
  ],
  exports: [
    PropertySearchComponent,
  ],
  providers: [
    PropertySearchService,
  ],
})
export class PropertySearchModule {}
