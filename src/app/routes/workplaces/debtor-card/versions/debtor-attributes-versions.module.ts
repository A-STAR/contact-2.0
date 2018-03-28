import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RoutesSharedModule } from '@app/routes/shared/shared.module';
import { SharedModule } from '@app/shared/shared.module';

import { DebtorAttributesVersionsComponent } from './debtor-attributes-versions.component';

const routes: Routes = [
  {
    path: '',
    component: DebtorAttributesVersionsComponent,
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    RoutesSharedModule,
    SharedModule,
  ],
  exports: [
    RouterModule,
  ],
  declarations: [
    DebtorAttributesVersionsComponent,
  ],
})
export class DebtorAttributesVersionsModule {}
