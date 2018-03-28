import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ObjectsGridDialogModule } from './dialog/objects-grid-dialog.module';
import { SharedModule } from '@app/shared/shared.module';

import { ObjectsGridComponent } from './objects-grid.component';

@NgModule({
  imports: [
    ObjectsGridDialogModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  exports: [
    ObjectsGridComponent,
  ],
  declarations: [
    ObjectsGridComponent,
  ]
})
export class ObjectsGridModule { }
