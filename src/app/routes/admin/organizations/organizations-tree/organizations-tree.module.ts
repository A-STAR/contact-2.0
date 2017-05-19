import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';
import { OrganizationsTreeComponent } from './organizations-tree.component';

@NgModule({
    imports: [
      SharedModule,
    ],
    exports: [
      OrganizationsTreeComponent
    ],
    declarations: [
      OrganizationsTreeComponent,
    ]
})
export class OrganizationsTreeModule { }
