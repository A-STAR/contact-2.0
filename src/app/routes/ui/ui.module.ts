import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '@app/shared/shared.module';

import { UIComponent } from './ui.component';

const routes: Routes = [
  {
    path: '',
    component: UIComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'inputs',
      },
      {
        path: 'inputs',
        loadChildren: './inputs/inputs.module#InputsModule',
      },
      {
        path: 'datetime',
        loadChildren: './datetime/datetime.module#DateTimeModule',
      },
      {
        path: 'grids',
        loadChildren: './grids/grids.module#GridsModule',
      },
      {
        path: 'icons',
        loadChildren: './icons/icons.module#IconsModule',
      },
      {
        path: 'ws',
        loadChildren: './ws/ws.module#WSModule',
      },
    ]
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
    UIComponent,
  ],
})
export class UIModule {}
