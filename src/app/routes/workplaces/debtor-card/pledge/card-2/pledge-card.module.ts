import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DynamicLoaderModule } from '@app/core/dynamic-loader/dynamic-loader.module';
import { SharedModule } from '@app/shared/shared.module';
import { WorkplacesSharedModule } from '@app/routes/workplaces/shared/shared.module';

import { PledgeCardComponent } from './pledge-card.component';
import { PledgeCardService } from '@app/routes/workplaces/debtor-card/pledge/card-2/pledge-card.service';

const routes: Routes = [
  {
    path: '',
    component: PledgeCardComponent,
  }
];

@NgModule({
  declarations: [
    PledgeCardComponent,
  ],
  exports: [
    RouterModule,
  ],
  imports: [
    DynamicLoaderModule.withModules(
      [
        {
          path: 'select-property',
          loadChildren: './dynamic-popups/select-property/select-property.module#SelectPropertyModule',
        },
        {
          path: 'select-person',
          loadChildren: './dynamic-popups/select-person/select-person.module#SelectPersonModule',
        },
      ],
    ),
    RouterModule.forChild(routes),
    SharedModule,
    WorkplacesSharedModule,
  ],
  providers: [
    PledgeCardService,
  ],
})
export class PledgeCardModule {}
