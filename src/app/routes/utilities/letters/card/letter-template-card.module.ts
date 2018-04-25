import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '@app/shared/shared.module';

import { LettersService } from '@app/routes/utilities/letters/letters.service';

import { LetterTemplateCardComponent } from './letter-template-card.component';

const routes: Routes = [
  {
    path: '',
    component: LetterTemplateCardComponent,
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  declarations: [
    LetterTemplateCardComponent,
  ],
  exports: [
    LetterTemplateCardComponent,
  ],
  providers: [
    LettersService
  ]
})
export class LetterTemplateCardModule { }
