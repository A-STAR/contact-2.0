import { Component, OnInit, ViewChild } from '@angular/core';
import { Http } from '@angular/http';
import { TreeNode } from '../../shared/components/flowtree/common/api';
import { TreeComponent } from '../../shared/components/flowtree/tree.component';
import { ITreeNodeDragAndDropPayload } from '../../shared/components/flowtree/tree.interface';

@Component({
  selector: 'app-workflow',
  templateUrl: './flow.component.html',
  styleUrls: ['./flow.component.scss']
})
export class FlowDemoComponent implements OnInit {

  @ViewChild('tree') tree: TreeComponent;
  selection: TreeNode;
  value: TreeNode[];
  dragulaOptions = {
    copy: true,
    moves: (el: Element, source: Element) => !source.classList.contains('ui-treenode-root')
  };

  private get rootNode(): TreeNode {
    return this.value[0];
  }

  constructor(private http: Http) { }

  ngOnInit(): void {
    this.http.get('assets/server/workflow.json')
      .map(data => data.json().data)
      .subscribe(
        data => {
          const files = {
            id: 0,
            label: 'Home',
            children: [].concat(data),
          };
          this.value = [files];
          this.prepareTree(this.rootNode);
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

  onNodeChangeLocation(payload: ITreeNodeDragAndDropPayload): void {
    const targetElement: TreeNode = this.findNodeRecursively(this.rootNode, payload.target);
    const sourceElement = this.findNodeRecursively(this.rootNode, payload.source);

    const sourceParentElement: TreeNode = sourceElement.parent;
    const sourceParentChildren: TreeNode[] = sourceParentElement.children;

    const sourceElementPosition: number = sourceParentChildren.findIndex((d) => d === sourceElement);
    if (sourceElementPosition > -1) {
      sourceParentChildren.splice(sourceElementPosition, 1);
    }
    if (!sourceParentChildren.length) {
      delete sourceParentElement.children;
      sourceParentElement.expanded = false;
    }

    if (payload.swap) {
      console.log('SWAP');
      const indexOf = targetElement.parent.children.findIndex((d) => d === targetElement);
      if (indexOf > -1) {
        targetElement.parent.children.splice(indexOf + 1, 0, sourceElement);
      }
      sourceElement.parent = targetElement.parent;
    } else {
      console.log('PUT');
      if (!targetElement.children) {
        targetElement.children = [];
      }
      targetElement.children.push(sourceElement);
      sourceElement.parent = targetElement;
    }
  }

  findNodeRecursively(node: TreeNode, id: string): TreeNode {
    if (node.id === parseInt(id, 10)) {
      return node;
    }
    if (node.children) {
      let result: TreeNode;
      node.children.forEach((childNode: TreeNode) => {
        const currentNode: TreeNode = this.findNodeRecursively(childNode, id);
        if (currentNode) {
          result = currentNode;
        }
      });
      return result;
    }
    return null;
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
