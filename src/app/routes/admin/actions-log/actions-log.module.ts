import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '../../../shared/shared.module';

import { ActionsLogService } from './actions-log.service';
import { ActionsLogResolver } from './actions-log-resolver.service';

import { ActionsLogComponent } from './actions-log.component';
import { ActionsLogFilterModule } from './filter/actions-log-filter.module';

const routes: Routes = [
  { path: '', component: ActionsLogComponent, resolve: { actionsLogData: ActionsLogResolver } },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    ActionsLogFilterModule,
  ],
  declarations: [
    ActionsLogComponent,
  ],
  providers: [
    ActionsLogService,
    ActionsLogResolver
  ]
})
export class ActionsLogModule {
}
