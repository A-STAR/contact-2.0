import { NgModule } from '@angular/core';
import { CommonModule} from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

// import { SharedModule } from '../../shared/components/flowtree/common/shared';
// import { TreeNodeTemplateLoader, Tree } from '../../shared/components/flowtree/tree.component';
// import { UITreeNode } from '../../shared/components/flowtree/uitreenode.component';
// import { NodeService } from './node.service';
import { TreeModule } from 'primeng/components/tree/tree';
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
