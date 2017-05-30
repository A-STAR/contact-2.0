import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogComponent } from './dialog.component';
import { EnvironmentModule } from '../../../core/environment/environment.module';

@NgModule({
  imports: [
    CommonModule,
    EnvironmentModule,
  ],
  exports: [
    DialogComponent,
  ],
  declarations: [
    DialogComponent,
  ],
  providers: [],
})
export class DialogModule { }
