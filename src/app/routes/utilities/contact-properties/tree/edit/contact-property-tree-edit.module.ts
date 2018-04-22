import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '@app/shared/shared.module';

import { GridsService } from '@app/shared/components/grids/grids.service';
import { GridsTreeActionService } from '@app/shared/components/grids/grids-tree-action.service';

import { ContactPropertyTreeEditComponent } from './contact-property-tree-edit.component';

@NgModule({
  imports: [
    FormsModule,
    SharedModule,
  ],
  exports: [
    ContactPropertyTreeEditComponent,
  ],
  declarations: [
    ContactPropertyTreeEditComponent,
  ],
  providers: [
    {
      provide: GridsService,
      useClass: GridsTreeActionService,
    }
  ],
})
export class ContactPropertyTreeEditModule {}
