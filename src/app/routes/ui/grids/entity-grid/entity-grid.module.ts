import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';

import { EntityGridComponent } from './entity-grid.component';
import { EntityAddActionComponent } from './actions/add/add-action.component';

import { EntityGridService } from './entity-grid.service';
import { EntityDeleteActionComponent } from './actions/delete/delete-action.component';
import { EntityEditActionComponent } from './actions/edit/edit-action.component';
import { EntityRefreshActionComponent } from './actions/refresh/refresh-action.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  exports: [
    EntityGridComponent,
    EntityAddActionComponent,
    EntityEditActionComponent,
    EntityDeleteActionComponent,
    EntityRefreshActionComponent
  ],
  declarations: [
    EntityGridComponent,
    EntityAddActionComponent,
    EntityEditActionComponent,
    EntityDeleteActionComponent,
    EntityRefreshActionComponent
  ],
  providers: [
    EntityGridService
  ]
})
export class EntityGridModule { }
