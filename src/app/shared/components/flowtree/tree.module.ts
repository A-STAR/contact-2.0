import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TreeComponent } from './tree.component';
import { UITreeNodeComponent } from './uitreenode.component';
import { TreeNodeTemplateLoaderComponent } from './treenodetemplateloader.component';
import { DragAndDropModule } from '../dnd/drag-and-drop.module';

@NgModule({
  imports: [
    CommonModule,
    DragAndDropModule,
  ],
  exports: [
    TreeComponent
  ],
  declarations: [
    TreeComponent,
    UITreeNodeComponent,
    TreeNodeTemplateLoaderComponent
  ],
})
export class TreeModule {
}
