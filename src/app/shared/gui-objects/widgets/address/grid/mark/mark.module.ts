import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { DialogModule } from '../../../../../components/dialog/dialog.module';

import { AddressGridMarkComponent } from './mark.component';

@NgModule({
  imports: [
    CommonModule,
    DialogModule,
    TranslateModule,
  ],
  exports: [
    AddressGridMarkComponent,
  ],
  declarations: [
    AddressGridMarkComponent,
  ],
  entryComponents: [
    AddressGridMarkComponent,
  ]
})
export class AddressGridMarkModule { }
