import { Component, OnInit, ViewChild } from '@angular/core';
import 'rxjs/add/operator/toPromise';

import { TreeNode } from '../../../shared/components/flowtree/common/api';
import { TreeComponent } from '../../../shared/components/flowtree/tree.component';
import { DepartmentsService } from './departments.service';

@Component({
  selector: 'app-departments',
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.scss']
})
export class DepartmentsComponent implements OnInit {
  @ViewChild('tree') tree: TreeComponent;
  selection: TreeNode;
  value: TreeNode[];

  constructor(private departmentsService: DepartmentsService) { }

  ngOnInit(): void {
    this.departmentsService.getNodes()
      .subscribe(
        data => {
          const files = {
            id: 0,
            label: 'Home',
            children: [].concat(data),
          };
          this.value = [files];
          this.prepareTree(this.value[0]);
        },
        error => console.error(error)
      );
  }

  onNodeSelect({ node }): void {
    // use for node selection, could operate on selection collection as well
    const parent = this.findParentRecursive(node);
    const isExpanded = node.expanded;
    this.collapseSiblings(parent);
    if (node.children) {
      node.expanded = !isExpanded;
    }
  }

  onNodeExpand({ node }): void {
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
