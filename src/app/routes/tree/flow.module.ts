import { NgModule } from '@angular/core';
import { CommonModule} from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TreeModule } from '../../shared/components/flowtree/tree.module';
import { FlowDemoComponent } from './flow.component';

const routes: Routes = [
    { path: '', component: FlowDemoComponent },
];

@NgModule({
    imports: [
      CommonModule,
      TreeModule,
      RouterModule.forChild(routes),
    ],
    exports: [
      // Tree,
      // SharedModule,
      TreeModule,
      RouterModule,
    ],
    providers: [
      // NodeService
    ],
    declarations: [
      // TreeNode,
      // UITreeNode,
      // TreeNodeTemplateLoader,
      FlowDemoComponent,
    ]
})
export class FlowModule { }
