import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';
import { OrganizationsService } from './organizations.service';
import { OrganizationsTreeComponent } from './organizations-tree.component';
import { OrganizationEditComponent } from './organization-edit/organization-edit.component';

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
      OrganizationsService,
    ],
})
export class OrganizationsTreeModule { }
