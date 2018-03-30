import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '@app/shared/shared.module';

import { ParamsService } from '../params.service';

import { ParamCardComponent } from './param-card.component';

const routes: Routes = [
  {
    path: '',
    component: ParamCardComponent,
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
  ],
  declarations: [
    ParamCardComponent,
  ],
  exports: [
    ParamCardComponent,
  ],
  providers: [
    ParamsService
  ]
})
export class ParamCardModule { }
