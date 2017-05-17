import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ENVIRONMENT_CONTAINER } from './environment.interface';

export function environmentFactory(): any {
  return document.body;
}

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    { provide: ENVIRONMENT_CONTAINER, useFactory: environmentFactory }
  ]
})
export class EnvironmentModule {
}
