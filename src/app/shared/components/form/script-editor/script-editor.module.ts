import { AceEditorModule } from 'ng2-ace-editor';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScriptEditorComponent } from './script-editor.component';

@NgModule({
  imports: [
    AceEditorModule,
    CommonModule,
  ],
  exports: [
    ScriptEditorComponent,
  ],
  declarations: [
    ScriptEditorComponent,
  ],
})
export class ScriptEditorModule {}
