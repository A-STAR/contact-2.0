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

  constructor(private dragulaService: DragulaService,
              private domHelper: DragAndDropDomHelper) {
  }

  public createAndAttachTo(component: IDraggedComponent): DragAndDropComponentPlugin {
    return new DragAndDropComponentPlugin(
      component,
      this.dragulaService,
      this.domHelper,
    );
  }
}

export class DragAndDropComponentPlugin implements OnInit, OnDestroy {

  private _draggedElementPosition: INodeOffset;
  private _isNodeAlreadySwapped: boolean;
  private _clientX: number;
  private _clientY: number;
  private _dragNode: Element;
  private _dragMirror: Element;
  private _cachedElements: Set<Element> = new Set<Element>();
  private _allElements: HTMLCollectionOf<Element>;
  private _dragSubscription: Subscription;
  private _dropSubscription: Subscription;
  private _dragEndSubscription: Subscription;
  private _moveSubscription: Function;

  constructor(
    private component: IDraggedComponent,
    private dragulaService: DragulaService,
    private domHandler: DragAndDropDomHelper,
  ) {
  }

  private onMouseMove(event: MouseEvent): void {
    this._clientX = event.clientX;
    this._clientY = event.clientY;

    this.deactivateNodes();

    const intersectedByTargetElements: IIntersectedNodeInfo[] = this.intersectedByTargetElements;
    const firstNode: IIntersectedNodeInfo = intersectedByTargetElements[0];
    const secondNode: IIntersectedNodeInfo = intersectedByTargetElements[1];

    if (intersectedByTargetElements.length === 1
      && this._dragNode !== firstNode.element
      && this.domHandler.isCursorInsideElement(firstNode, this._clientX, this._clientY)) {

      this._cachedElements.add(firstNode.element);
      this.renderer.addClass(firstNode.element, 'tree-dnd-active');
    } else if (intersectedByTargetElements.length === 2) {

      this._cachedElements.add(firstNode.element);
      this._cachedElements.add(secondNode.element);
      intersectedByTargetElements.forEach((value: IIntersectedNodeInfo) =>
        this.renderer.addClass(value.element, 'tree-dnd-swapped-active'));
    }
  }

  ngOnInit(): void {
    this._dragSubscription = this.dragulaService.drag.subscribe((value: Array<Element>) => {
      this._isNodeAlreadySwapped = false;
      this._dragNode = value[1];
      this.addMouseMoveListener();
    });

    this._dropSubscription = this.dragulaService.drop.subscribe((value: Array<Element>) => {
      this.deactivateNodes();
      this.removeMouseMoveListener();

      if (value[1] && value[2]) {
        this.component.changeLocation.emit({
          swap: false,
          source: this.toNodeId(value[1]),
          target: this.toNodeId(value[2])
        });
        this._isNodeAlreadySwapped = true;
      }
    });

    this._dragEndSubscription = this.dragulaService.dragend.subscribe((value: Array<Element>) => {
      this._dragMirror = null; // Here mirror element does not already exist

      const attr: string = this.toNodeId(value[1]);
      this.renderer.removeChild(value[1].parentNode, value[1]);

      if (!this._isNodeAlreadySwapped) {
        const intersectedByTargetElements: IIntersectedNodeInfo[] = this.intersectedByTargetElements;
        if (intersectedByTargetElements.length === 2) {
          // The change location operation can be executed when only two nodes are intersected at the same time
          this.component.changeLocation.emit({
            swap: true,
            target: this.toNodeId(intersectedByTargetElements[0].element),
            source: attr
          });
        }
      }
      this.clearCache();
    });
  }

  ngOnDestroy(): void {
    this._dragEndSubscription.unsubscribe();
    this._dropSubscription.unsubscribe();
    this._dragSubscription.unsubscribe();
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

  private deactivateNodes(): void {
    this._cachedElements.forEach((el: Element) => {
      this.renderer.removeClass(el, 'tree-dnd-active');
      this.renderer.removeClass(el, 'tree-dnd-swapped-active');
    });
  }

  private get intersectedByTargetElements(): IIntersectedNodeInfo[] {
    return this.domHandler.getIntersectedByTargetElements(
      this.draggedElementPosition,
      this._allElements = this._allElements ||
        this.component.elementRef.nativeElement.querySelectorAll(this.component.elementSelector)
    );
  }

  private get renderer(): Renderer2 {
    return this.component.renderer;
  }

  private clearCache(): void {
    this._dragMirror = null;
    this._dragNode = null;
    this._allElements = null;
    this._cachedElements.clear();
  }

  private get draggedElementPosition(): INodeOffset {
    const mirrorEl: Element = this._dragMirror = this._dragMirror || document.body.getElementsByClassName('gu-mirror')[0];
    return mirrorEl
      ? this._draggedElementPosition = this.domHandler.getOffset(mirrorEl)
      : this._draggedElementPosition;
  }

  private toNodeId(element: Element): string {
    return element.getAttribute('nodeid');
  }
}
