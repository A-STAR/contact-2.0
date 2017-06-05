import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../shared/shared.module';

import { OrganizationEditComponent } from './edit/organization-edit.component';
import { OrganizationsTreeComponent } from './organizations-tree.component';

@NgModule({
    imports: [
      SharedModule,
    ],
    exports: [
      OrganizationsTreeComponent,
    ],
    declarations: [
      OrganizationsTreeComponent,
      OrganizationEditComponent,
    ]
})
export class OrganizationsTreeModule { }
