import {
  OnInit,
  OnDestroy,
  Injectable,
  Renderer2,
} from '@angular/core';

import { Subscription } from 'rxjs/Subscription';
import { DragulaService } from 'ng2-dragula';

import { DragAndDropDomHelper } from './drag-and-drop.dom-helper';
import { IDraggedComponent, IIntersectedNodeInfo, INodeOffset } from './drag-and-drop.interface';

@Injectable()
export class DragAndDropComponentPluginFactory {

  constructor(
    private dragulaService: DragulaService,
    private domHelper: DragAndDropDomHelper
  ) { }

  createAndAttachTo(component: IDraggedComponent): DragAndDropComponentPlugin {
    return new DragAndDropComponentPlugin(
      component,
      this.dragulaService,
      this.domHelper,
    );
  }
}

export class DragAndDropComponentPlugin implements OnInit, OnDestroy {

  private static SWAPPED_NODES_COUNT = 2;
  private static MOVED_NODES_COUNT = 1;
  private static DND_SWAPPED_ACTIVE_CLS = 'dnd-swapped-active';
  private static DND_ACTIVE_CLS = 'dnd-active';

  private _isCursorInsideElement: boolean;
  private _draggedElementPosition: INodeOffset;
  private _isNodeAlreadyMovedOrRejected: boolean;
  private _clientX: number;
  private _clientY: number;
  private _dragNode: Element;
  private _dragMirror: Element;
  private _activeElements: Set<Element> = new Set<Element>();
  private _dragSubscription: Subscription;
  private _dropSubscription: Subscription;
  private _dragEndSubscription: Subscription;
  private _overSubscription: Subscription;
  private _outSubscription: Subscription;
  private _moveSubscription: Function;

  constructor(
    private component: IDraggedComponent,
    private dragulaService: DragulaService,
    private domHelper: DragAndDropDomHelper,
  ) {
    component.dragulaOptions = { copy: true };
  }

  private onMouseMove(event: MouseEvent): void {
    this._clientX = event.clientX;
    this._clientY = event.clientY;

    this.removeAllActiveElements();

    const intersectedByTargetElements: IIntersectedNodeInfo[] = this.intersectedByTargetElements;
    const firstNode: IIntersectedNodeInfo = intersectedByTargetElements[0];
    const secondNode: IIntersectedNodeInfo = intersectedByTargetElements[1];

    if (this.canMove(intersectedByTargetElements)) {
      this._activeElements.add(firstNode.element);
      this.renderer.addClass(firstNode.element, DragAndDropComponentPlugin.DND_ACTIVE_CLS);

    } else if (this.canSwap(intersectedByTargetElements)) {
      this._activeElements.add(firstNode.element);
      this._activeElements.add(secondNode.element);
      intersectedByTargetElements.forEach((value: IIntersectedNodeInfo) =>
        this.renderer.addClass(value.element, DragAndDropComponentPlugin.DND_SWAPPED_ACTIVE_CLS));
    }
  }

  ngOnInit(): void {
    this._dragSubscription = this.dragulaService.drag.subscribe((value: Element[]) => {
      this._isNodeAlreadyMovedOrRejected = false;
      this._dragNode = value[1];
      this.addMouseMoveListener();
    });

    this._overSubscription = this.dragulaService.over.subscribe(() => this._isCursorInsideElement = true);
    this._outSubscription = this.dragulaService.out.subscribe(() => this._isCursorInsideElement = false);

    this._dropSubscription = this.dragulaService.drop.subscribe((value: Element[]) => {
      this.removeMouseMoveListener();

      const sourceElement: Element = value[1];
      const targetElement: Element = value[2];
      if (sourceElement && targetElement
            && this._activeElements.size === DragAndDropComponentPlugin.MOVED_NODES_COUNT) {
        this.component.changeLocation({
          swap: false,
          source: this.domHelper.extractNodeId(sourceElement),
          target: this.domHelper.extractNodeId(targetElement)
        });
        this._isNodeAlreadyMovedOrRejected = true;
      }
    });

    this._dragEndSubscription = this.dragulaService.dragend.subscribe((value: Element[]) => {
      const sourceElement: Element = value[1];
      const sourceNodeId: string = this.domHelper.extractNodeId(sourceElement);
      this.renderer.removeChild(sourceElement.parentNode, sourceElement);

      if (!this._isNodeAlreadyMovedOrRejected
            && this._activeElements.size === DragAndDropComponentPlugin.SWAPPED_NODES_COUNT) {
          this.component.changeLocation({
            swap: true,
            target: this.domHelper.extractNodeId(this._activeElements.values().next().value),
            source: sourceNodeId
          });
      }

      this.removeAllActiveElements();
      this.clearCache();
    });
  }

  ngOnDestroy(): void {
    this._dragEndSubscription.unsubscribe();
    this._dropSubscription.unsubscribe();
    this._dragSubscription.unsubscribe();
    this._overSubscription.unsubscribe();
    this._outSubscription.unsubscribe();
    this.clearCache();
    this.removeMouseMoveListener();
  }

  private addMouseMoveListener(): void {
    this._moveSubscription =
      this.renderer.listen(document.body, 'mousemove', (event: MouseEvent) => this.onMouseMove(event));
  }

  private removeMouseMoveListener(): void {
    if (this._moveSubscription) {
      this._moveSubscription();
    }
  }

  private removeAllActiveElements(): void {
    this._activeElements.forEach((el: Element) => {
      this.renderer.removeClass(el, DragAndDropComponentPlugin.DND_ACTIVE_CLS);
      this.renderer.removeClass(el, DragAndDropComponentPlugin.DND_SWAPPED_ACTIVE_CLS);
    });
    this._activeElements.clear();
  }

  private get intersectedByTargetElements(): IIntersectedNodeInfo[] {
    return this.domHelper.getIntersectedByTargetElements(
      this._dragNode,
      this.draggedElementPosition,
      this.domHelper.queryElements(this.component.elementRef.nativeElement, this.component.elementSelector)
    );
  }

  private get renderer(): Renderer2 {
    return this.component.renderer;
  }

  private clearCache(): void {
    this._dragMirror = null;
    this._dragNode = null;
  }

  private canMove(intersectedByTargetElements: IIntersectedNodeInfo[]): boolean {
    const firstNode: IIntersectedNodeInfo = intersectedByTargetElements[0];

    return intersectedByTargetElements.length === DragAndDropComponentPlugin.MOVED_NODES_COUNT
      && this._dragNode !== firstNode.element
      && this._isCursorInsideElement;
  }

  private canSwap(intersectedByTargetElements: IIntersectedNodeInfo[]): boolean {
    const firstNode: IIntersectedNodeInfo = intersectedByTargetElements[0];
    const secondNode: IIntersectedNodeInfo = intersectedByTargetElements[1];

    return intersectedByTargetElements.length === DragAndDropComponentPlugin.SWAPPED_NODES_COUNT
      && this._dragNode !== secondNode.element
      && this._dragNode !== firstNode.element;
  }

  private get draggedElementPosition(): INodeOffset {
    const mirrorEl: Element = this._dragMirror = this._dragMirror || this.domHelper.queryDragulaMirrorElement();
    return mirrorEl
      ? this._draggedElementPosition = this.domHelper.getOffset(mirrorEl)
      : this._draggedElementPosition;
  }
}
