import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeComponent } from './tree.component';
import { UITreeNodeComponent } from './uitreenode.component';
import { TreeNodeTemplateLoaderComponent } from './treenodetemplateloader.component';
import {DragulaModule} from 'ng2-dragula';

@NgModule({
    imports: [
      CommonModule,
      DragulaModule,
    ],
    exports: [
      TreeComponent
    ],
    declarations: [
      TreeComponent,
      UITreeNodeComponent,
      TreeNodeTemplateLoaderComponent
    ]
})
export class TreeModule {
}
