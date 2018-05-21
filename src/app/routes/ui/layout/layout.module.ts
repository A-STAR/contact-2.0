import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DebtorService } from '@app/routes/workplaces/debtor-card/debtor.service';
import { SharedModule } from '@app/shared/shared.module';
import { WorkplacesService } from '@app/routes/workplaces/workplaces.service';

import { LayoutComponent } from './layout.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
  ],
  exports: [
    RouterModule,
  ],
  declarations: [
    LayoutComponent,
  ],
  providers: [
    DebtorService,
    WorkplacesService
  ]
})
export class LayoutModule {}
