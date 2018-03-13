import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '@app/shared/shared.module';
import { OrganizationsTreeModule } from './organizations-tree/organizations-tree.module';
import { OrganizationsEmployeesModule } from './employees/employees.module';

import { OrganizationsService } from './organizations.service';

import { OrganizationsComponent } from './organizations.component';

const routes: Routes = [
  {
    path: '',
    component: OrganizationsComponent,
    data: {
      reuse: true,
    },
  },
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    OrganizationsTreeModule,
    OrganizationsEmployeesModule
  ],
  exports: [
    RouterModule,
  ],
  declarations: [
    OrganizationsComponent,
  ],
  providers: [
    OrganizationsService,
  ],
})
export class OrganizationsModule { }
