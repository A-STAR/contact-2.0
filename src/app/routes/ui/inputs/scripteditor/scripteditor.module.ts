import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '@app/shared/shared.module';

import { ScriptEditorComponent } from './scripteditor.component';

@NgModule({
  imports: [
    FormsModule,
    SharedModule,
  ],
  declarations: [
    ScriptEditorComponent,
  ],
  exports: [
    ScriptEditorComponent,
  ]
})
export class ScriptEditorModule {}
