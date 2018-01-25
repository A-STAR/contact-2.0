import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../shared/shared.module';

import { GroupEditComponent } from './edit.component';

// const routes: Routes = [
//   {
//     path: '',
//     component: GroupGridComponent,
//     data: {
//       reuse: true,
//     },
//   },
// ];


@NgModule({
  imports: [
    SharedModule,
  ],
  exports: [
    GroupEditComponent
  ],
  declarations: [
    GroupEditComponent
  ],
})
export class GroupEditModule {}
