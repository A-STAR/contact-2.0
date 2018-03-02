import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';

import { OrganizationEditComponent } from './edit/organization-edit.component';
import { OrganizationsTreeComponent } from './organizations-tree.component';

import { OrganizationsTreeService } from './organizations-tree.service';

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
    ],
    providers: [
      OrganizationsTreeService
    ]
})
export class OrganizationsTreeModule { }
