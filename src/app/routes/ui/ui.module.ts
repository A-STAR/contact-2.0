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
        redirectTo: 'buttons',
      },
      {
        path: 'buttons',
        loadChildren: './buttons/buttons.module#ButtonsModule',
      },
      {
        path: 'inputs',
        loadChildren: './inputs/inputs.module#InputsModule',
      },
      {
        path: 'select',
        loadChildren: './select/select.module#SelectModule',
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
        path: 'forms',
        loadChildren: './forms/forms.module#FormsModule',
      },
      {
        path: 'layout/:debtId',
        loadChildren: './layout/layout.module#LayoutModule',
      },
      {
        path: 'areas',
        loadChildren: './areas/areas.module#AreasModule',
      },
      {
        path: 'icons',
        loadChildren: './icons/icons.module#IconsModule',
      },
      {
        path: 'ws',
        loadChildren: './ws/ws.module#WSModule',
      },
      {
        path: 'maps',
        loadChildren: './maps/maps.module#MapsModule',
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
