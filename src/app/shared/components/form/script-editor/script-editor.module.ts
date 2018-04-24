import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScriptEditorComponent } from './script-editor.component';

import { ScriptEditorDirective } from './script-editor.directive';

import { ScriptEditorService } from './script-editor.service';

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    ScriptEditorComponent,
  ],
  declarations: [
    ScriptEditorComponent,
    ScriptEditorDirective,
  ],
  providers: [
    ScriptEditorService
  ]
})
export class ScriptEditorModule {}
