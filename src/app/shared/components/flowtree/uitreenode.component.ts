import { Component, OnInit, Input, Inject, forwardRef } from '@angular/core';
import { TreeNode } from './common/api';
import { TreeComponent } from './tree.component';

@Component({
    selector: 'app-tree-node',
    templateUrl: './uitreenode.component.html'
})
export class UITreeNodeComponent implements OnInit {

    static ICON_CLASS = 'ui-treenode-icon fa fa-fw';

    static DEFAULT_BG_COLOR = '#fff';
    static DEFAULT_SELECTED_BG_COLOR = '#def';

    draghoverPrev: boolean;
    draghoverNext: boolean;
    draghoverNode: boolean;

    @Input() node: TreeNode;

    @Input() parentNode: TreeNode;

    @Input() root: boolean;

    @Input() index: number;

    @Input() firstChild: boolean;

    @Input() lastChild: boolean;

    constructor(@Inject(forwardRef(() => TreeComponent)) public tree: TreeComponent) {}

    ngOnInit() {
        this.node.parent = this.parentNode;
    }

    getIcon() {
        let icon: string;

        if (this.node.icon) {
            icon = this.node.icon;
        } else {
            icon = this.node.expanded && this.node.children && this.node.children.length ? this.node.expandedIcon : this.node.collapsedIcon;
        }

        return UITreeNodeComponent.ICON_CLASS + ' ' + icon;
    }

    getBgColor() {
        return this.isSelected() ?
            this.node.selectedBgColor || UITreeNodeComponent.DEFAULT_SELECTED_BG_COLOR :
            this.node.bgColor || UITreeNodeComponent.DEFAULT_BG_COLOR;
    }

    isLeaf() {
        return this.node.leaf === false ? false : !(this.node.children && this.node.children.length);
    }

    toggle(event: Event) {
        if (this.node.expanded) {
            this.tree.onNodeCollapse.emit({originalEvent: event, node: this.node});
        } else {
            this.tree.onNodeExpand.emit({originalEvent: event, node: this.node});
        }

        this.node.expanded = !this.node.expanded;
    }

    onNodeClick(event: MouseEvent) {
        this.tree.onNodeClick(event, this.node);
    }

    onNodeTouchEnd() {
        this.tree.onNodeTouchEnd();
    }

    onNodeRightClick(event: MouseEvent) {
        this.tree.onNodeRightClick(event, this.node);
    }

    isSelected() {
        return this.tree.isSelected(this.node);
    }

    onDropPoint(event: Event, position: number) {
        event.preventDefault();
        const dragNode = this.tree.dragNode;
        const dragNodeIndex = this.tree.dragNodeIndex;
        const dragNodeScope = this.tree.dragNodeScope;
        const isValidDropPointIndex = this.tree.dragNodeTree === this.tree ? (position === 1 || dragNodeIndex !== this.index - 1) : true;

        if (this.tree.allowDrop(dragNode, this.node, dragNodeScope) && isValidDropPointIndex) {
            const newNodeList = this.node.parent ? this.node.parent.children : this.tree.value;
            this.tree.dragNodeSubNodes.splice(dragNodeIndex, 1);
            if (position < 0) {
                newNodeList.splice(this.index, 0, dragNode);
            } else {
                newNodeList.push(dragNode);
            }
            this.tree.dragDropService.stopDrag({
                node: dragNode,
                subNodes: this.node.parent ? this.node.parent.children : this.tree.value,
                index: dragNodeIndex
            });
        }

        this.draghoverPrev = false;
        this.draghoverNext = false;
    }

    onDropPointDragOver(event) {
        event.dataTransfer.dropEffect = 'move';
        event.preventDefault();
    }

    onDropPointDragEnter(event: Event, position: number) {
        if (this.tree.allowDrop(this.tree.dragNode, this.node, this.tree.dragNodeScope)) {
            if (position < 0) {
                this.draghoverPrev = true;
            } else {
                this.draghoverNext = true;
            }
        }
    }

    onDropPointDragLeave(event: Event) {
        this.draghoverPrev = false;
        this.draghoverNext = false;
    }

    onDragStart(event) {
        if (this.tree.draggableNodes && this.node.draggable !== false) {
            event.dataTransfer.setData('text', 'data');

            this.tree.dragDropService.startDrag({
                tree: this,
                node: this.node,
                subNodes: this.node.parent ? this.node.parent.children : this.tree.value,
                index: this.index,
                scope: this.tree.draggableScope
            });
        } else {
            event.preventDefault();
        }
    }

    onDragStop(event) {
        this.tree.dragDropService.stopDrag({
            node: this.node,
            subNodes: this.node.parent ? this.node.parent.children : this.tree.value,
            index: this.index
        });
    }

    onDropNodeDragOver(event) {
        event.dataTransfer.dropEffect = 'move';
        if (this.tree.droppableNodes) {
            event.preventDefault();
            event.stopPropagation();
        }
    }

    onDropNode(event) {
        if (this.tree.droppableNodes && this.node.droppable !== false) {
            event.preventDefault();
            event.stopPropagation();
            const dragNode = this.tree.dragNode;
            if (this.tree.allowDrop(dragNode, this.node, this.tree.dragNodeScope)) {
                const dragNodeIndex = this.tree.dragNodeIndex;
                this.tree.dragNodeSubNodes.splice(dragNodeIndex, 1);

                if(this.node.children) {
                    this.node.children.push(dragNode);
                } else {
                    this.node.children = [dragNode];
                }

                this.tree.dragDropService.stopDrag({
                    node: dragNode,
                    subNodes: this.node.parent ? this.node.parent.children : this.tree.value,
                    index: this.tree.dragNodeIndex
                });

                this.tree.onNodeDrop.emit({
                    originalEvent: event,
                    dragNode: dragNode,
                    dropNode: this.node
                })
            }
        }

        this.draghoverNode = false;
    }

    onDropNodeDragEnter(event) {
        if (this.tree.droppableNodes && this.node.droppable !== false && this.tree.allowDrop(this.tree.dragNode, this.node, this.tree.dragNodeScope)) {
            this.draghoverNode = true;
        }
    }

    onDropNodeDragLeave(event) {
        if (this.tree.droppableNodes) {
            const rect = event.currentTarget.getBoundingClientRect();
            if (event.x > rect.left + rect.width || event.x < rect.left || event.y >= Math.floor(rect.top + rect.height) || event.y < rect.top) {
                this.draghoverNode = false;
            }
        }
    }
}
