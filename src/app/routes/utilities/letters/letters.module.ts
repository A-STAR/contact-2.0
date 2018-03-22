import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '../../../shared/shared.module';
import { LetterTemplatesGridModule } from './grid/letter-templates-grid.module';

import { LettersService } from './letters.service';

import { LetterTemplatesGridComponent } from './grid/letter-templates-grid.component';

const routes: Routes = [
  {
    path: '',
    component: LetterTemplatesGridComponent,
    data: {
      reuse: true,
    },
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    LetterTemplatesGridModule,
  ],
  providers: [
    LettersService
  ]
})
export class LettersModule {}
