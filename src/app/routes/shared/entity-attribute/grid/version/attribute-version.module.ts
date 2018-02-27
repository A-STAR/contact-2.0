import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { DialogModule } from '@app/shared/components/dialog/dialog.module';
import { DynamicFormModule } from '@app/shared/components/form/dynamic-form/dynamic-form.module';
import { AttributeVersionEditModule } from './edit/attribute-version-edit.module';
import { Toolbar2Module } from '@app/shared/components/toolbar-2/toolbar-2.module';
import { GridModule } from '@app/shared/components/grid/grid.module';

import { AttributeVersionComponent } from './attribute-version.component';

@NgModule({
  imports: [
    CommonModule,
    DialogModule,
    DynamicFormModule,
    GridModule,
    Toolbar2Module,
    TranslateModule,
    AttributeVersionEditModule
  ],
  declarations: [
    AttributeVersionComponent
  ],
  exports: [
    AttributeVersionComponent
  ],
})
export class AttributeVersionModule { }
