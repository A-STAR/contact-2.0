import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '@app/shared/shared.module';

import { GroupCardComponent } from './group-card.component';

const routes: Routes = [
  {
    path: '',
    component: GroupCardComponent,
    data: {
      reuse: true,
    },
  },
];

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    SharedModule
  ],
  exports: [
    GroupCardComponent,
  ],
  declarations: [
    GroupCardComponent,
  ]
})
export class GroupCardModule { }
