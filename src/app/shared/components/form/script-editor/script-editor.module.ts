import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScriptEditorComponent } from './script-editor.component';

import { ScriptEditorDirective } from './script-editor.directive';

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
})
export class ScriptEditorModule {}
