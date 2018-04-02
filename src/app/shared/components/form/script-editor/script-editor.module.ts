import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScriptEditorComponent } from './script-editor.component';

import { AceEditorDirective } from './ng-ace.directive';

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    ScriptEditorComponent,
  ],
  declarations: [
    ScriptEditorComponent,
    AceEditorDirective,
  ],
})
export class ScriptEditorModule {}
