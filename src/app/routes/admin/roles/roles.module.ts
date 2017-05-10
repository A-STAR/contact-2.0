import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {DialogModule, ButtonModule} from 'primeng/primeng';

import { SharedModule } from '../../../shared/shared.module';
import { RolesComponent } from './roles.component';
import { RolesEditComponent } from './roles-edit/roles-edit.component';
import { RolesRemoveComponent } from './roles-remove/roles-remove.component';
import { RolesAndPermissionsComponent } from './roles-and-permissions.component';
import { PermissionsModule } from './permissions/permissions.module';

const routes: Routes = [
  {path: '', component: RolesAndPermissionsComponent},
];

@NgModule({
  imports: [
    ButtonModule,
    DialogModule,
    RouterModule.forChild(routes),
    SharedModule,
    PermissionsModule,
  ],
  exports: [
    RouterModule
  ],
  declarations: [
    RolesAndPermissionsComponent,
    RolesComponent,
    RolesEditComponent,
    RolesRemoveComponent,
  ]
})
export class RolesModule {
}
