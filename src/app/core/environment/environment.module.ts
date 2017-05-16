import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnvironmentContainer } from './environment.interface';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    { provide: EnvironmentContainer, useValue: document.body }
  ]
})
export class EnvironmentModule { }
