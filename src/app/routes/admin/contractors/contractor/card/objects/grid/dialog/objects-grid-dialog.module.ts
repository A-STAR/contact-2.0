import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';

import { ObjectsGridDialogComponent } from './objects-grid-dialog.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  exports: [
    ObjectsGridDialogComponent,
  ],
  declarations: [
    ObjectsGridDialogComponent,
  ],
})
export class ObjectsGridDialogModule { }
