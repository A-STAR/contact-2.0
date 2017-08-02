import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { DialogModule } from '../../../components/dialog/dialog.module';
import { DynamicFormModule } from '../../../components/form/dynamic-form/dynamic-form.module';
import { GridModule } from '../../../components/grid/grid.module';
import { Toolbar2Module } from '../../../components/toolbar-2/toolbar-2.module';

import { IdentityService } from './identity.service';

import { IdentityGridComponent } from './identity.component';
import { AddIdentityComponent } from './add/add.identity.component';

@NgModule({
  imports: [
    CommonModule,
    DialogModule,
    DynamicFormModule,
    GridModule,
    Toolbar2Module,
    TranslateModule,
  ],
  exports: [
    IdentityGridComponent
  ],
  declarations: [
    AddIdentityComponent,
    IdentityGridComponent,
  ],
  providers: [
    IdentityService
  ],
})
export class IdentityModule { }
