import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Routes, RouterModule } from '@angular/router';

import { DialogModule } from '../../../../../components/dialog/dialog.module';
import { DynamicFormModule } from '../../../../../components/form/dynamic-form/dynamic-form.module';
import { AttributeVersionEditModule } from './edit/attribute-version-edit.module';
import { Toolbar2Module } from '../../../../../components/toolbar-2/toolbar-2.module';
import { GridModule } from '../../../../../components/grid/grid.module';

import { AttributeVersionComponent } from './attribute-version.component';

const routes: Routes = [
  { path: 'versions', component: AttributeVersionComponent, },
];

@NgModule({
  imports: [
    CommonModule,
    DialogModule,
    DynamicFormModule,
    GridModule,
    Toolbar2Module,
    TranslateModule,
    AttributeVersionEditModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    AttributeVersionComponent
  ],
  exports: [
    AttributeVersionComponent
  ],
})
export class AttributeVersionModule { }
