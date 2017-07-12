import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import './crossvent.patch';
import { TreeComponent } from './tree.component';
import { TreeNodeComponent } from './treenode/treenode.component';
import { DragAndDropModule } from '../dnd/drag-and-drop.module';

@NgModule({
  imports: [
    CommonModule,
    DragAndDropModule,
  ],
  exports: [
    TreeComponent,
  ],
  declarations: [
    TreeComponent,
    TreeNodeComponent,
  ],
})
export class TreeModule {
}
