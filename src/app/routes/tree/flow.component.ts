import { Component, OnInit, ViewChild } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

// import { FlowService } from './flow.service';
// import { TreeNode } from '../../shared/components/flowtree/common/api';
import { TreeNode } from 'primeng/components/common/api';
import { Tree } from 'primeng/primeng';

@Component({
  selector: 'app-workflow',
  templateUrl: './flow.component.html',
  styleUrls: ['./flow.component.scss'],
  // encapsulation: ViewEncapsulation.None
})
export class FlowDemoComponent implements OnInit {
  @ViewChild(Tree) tree: Tree;
  selection: TreeNode;
  value: TreeNode[];

  constructor(private http: Http) { }

  ngOnInit() {
    this.http.get('assets/server/workflow.json')
      .toPromise()
      .then((data) => {
        setTimeout(() => {
          const files = {
            id: 0,
            label: 'Home',
            children: [].concat(data.json().data),
          };
          this.value = [files];
          this.prepareTree(this.value[0]);
        }, 0);
      })
      .catch(error => console.error(error));
  }

  onNodeSelect({ node }) {
    // use for node selection, could operate on selection collection as well
    const parent = this.findParentRecursive(node);
    console.log(parent);
    this.collapseSiblings(parent);
    node.expanded = true;
  }

  onNodeExpand({ node }) {
    const parent = this.findParentRecursive(node);
    this.collapseSiblings(parent);
    // console.log(`on find recursive`, parent);
  }

  private findParentRecursive(node: TreeNode, parent: TreeNode[] = null): any {
    if (!parent) {
      return this.findParentRecursive(node, this.tree.value);
    }

    return parent.reduce((acc, child) => {
      if (child.id === node.id) {
        // NOTE: return parent since we are looking for the element's siblings!
        return parent;
      }

      if (child.children) {
        return this.findParentRecursive(node, child.children) || acc;
      }

      return acc;

    }, null);
  }

  private collapseSiblings(node: TreeNode[] | null): void {
    // console.log('collapse this', node);
    if (!node || !node.length) {
      return;
    }
    node.forEach(childNode => {
        childNode.expanded = false;
    });
  }

  private prepareTree(node: TreeNode, parent: TreeNode = null): void {
    node.expanded = false;
    node.parent = parent;
    if (node.children) {
        node.children.forEach(childNode => {
            this.prepareTree(childNode, node);
        });
    }
  }
}
