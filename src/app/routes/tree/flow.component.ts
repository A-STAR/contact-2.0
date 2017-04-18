import { Component, OnInit, ViewChild } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { TreeNode } from '../../shared/components/flowtree/common/api';
import { TreeComponent } from '../../shared/components/flowtree/tree.component';

@Component({
  selector: 'app-workflow',
  templateUrl: './flow.component.html',
  styleUrls: ['./flow.component.scss']
})
export class FlowDemoComponent implements OnInit {
  @ViewChild('tree') tree: TreeComponent;
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
    const isExpanded = node.expanded;
    this.collapseSiblings(parent);
    if (node.children) {
      node.expanded = !isExpanded;
    }
  }

  onNodeExpand({ node }) {
    const parent = this.findParentRecursive(node);
    this.collapseSiblings(parent);
    this.selection = node;
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

  private collapseSiblings(nodes: TreeNode[]): void {
    if (!nodes || !nodes.length) {
      return;
    }
    nodes.forEach(childNode => {
      childNode.expanded = false;
      this.collapseChildrenRecursive(childNode);
    });
  }

  private collapseChildrenRecursive(node: TreeNode): void {
    if (!node || !node.children) {
      return;
    }
    node.children.forEach(childNode => {
      childNode.expanded = false;
      this.collapseChildrenRecursive(childNode);
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
