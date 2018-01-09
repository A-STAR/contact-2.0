import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GridModule } from './grid/grid.module';
import { SharedModule } from '../../../shared/shared.module';

import { ContactLogService } from './contact-log.service';

import { ContactLogComponent } from './contact-log.component';

const routes: Routes = [
  {
    path: '',
    component: ContactLogComponent,
    data: {
      reuse: true,
    },
  },
];

@NgModule({
  imports: [
    GridModule,
    RouterModule.forChild(routes),
    SharedModule,
  ],
  declarations: [
    ContactLogComponent,
  ],
  providers: [
    ContactLogService,
  ],
})
export class ContactLogModule {}
