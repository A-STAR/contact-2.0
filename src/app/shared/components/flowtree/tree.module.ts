import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {DragAndDropModule} from '../dnd/drag-and-drop.module';

import { TreeComponent } from './tree.component';
import { UITreeNodeComponent } from './uitreenode.component';
import { TreeNodeTemplateLoaderComponent } from './treenodetemplateloader.component';

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
