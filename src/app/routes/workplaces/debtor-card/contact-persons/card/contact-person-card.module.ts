import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DynamicLoaderModule } from '@app/core/dynamic-loader/dynamic-loader.module';
import { ContactPersonCardService } from './contact-person-card.service';
import { SharedModule } from '@app/shared/shared.module';
import { WorkplacesSharedModule } from '@app/routes/workplaces/shared/shared.module';

import { ContactPersonCardComponent } from './contact-person-card.component';

const routes: Routes = [
  {
    path: '',
    component: ContactPersonCardComponent,
  }
];

@NgModule({
  declarations: [
    ContactPersonCardComponent,
  ],
  exports: [
    RouterModule,
  ],
  imports: [
    CommonModule,
    DynamicLoaderModule.withModules(
      [
        {
          path: 'select-person',
          // tslint:disable-next-line:max-line-length
          loadChildren: 'app/routes/workplaces/debtor-card/contact-persons/card/dynamic-popups/select-person/select-person.module#SelectPersonModule',
        },
      ],
    ),
    RouterModule.forChild(routes),
    SharedModule,
    WorkplacesSharedModule,
  ],
  providers: [
    ContactPersonCardService,
  ],
})
export class ContactPersonCardModule {}
