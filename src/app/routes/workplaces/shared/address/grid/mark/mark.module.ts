import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { DialogModule } from '@app/shared/components/dialog/dialog.module';
import { DynamicFormModule } from '@app/shared/components/form/dynamic-form/dynamic-form.module';
import { GridModule } from '@app/shared/components/grid/grid.module';

import { MarkService } from './mark.service';

import { AddressGridMarkComponent } from './mark.component';

@NgModule({
  imports: [
    CommonModule,
    DialogModule,
    DynamicFormModule,
    GridModule,
    TranslateModule,
  ],
  exports: [
    AddressGridMarkComponent,
  ],
  declarations: [
    AddressGridMarkComponent,
  ],
  providers: [
    MarkService,
  ],
  entryComponents: [
    AddressGridMarkComponent,
  ]
})
export class AddressGridMarkModule { }
