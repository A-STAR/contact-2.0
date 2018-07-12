import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { ButtonModule } from '@app/shared/components/button/button.module';
import { CheckModule } from '@app/shared/components/form/check/check.module';
import { DropdownModule } from '../dropdown/dropdown.module';

import { ToolbarComponent } from './toolbar.component';
import { ToolbarItemComponent } from './item/toolbar-item.component';

@NgModule({
  imports: [
    CheckModule,
    CommonModule,
    ButtonModule,
    DropdownModule,
    FormsModule,
    TranslateModule,
  ],
  exports: [
    ToolbarComponent,
  ],
  declarations: [
    ToolbarComponent,
    ToolbarItemComponent,
  ]
})
export class ToolbarModule {}
