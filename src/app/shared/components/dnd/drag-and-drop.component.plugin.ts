import { OnInit, OnDestroy, Renderer2, Injectable } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';
import { DragulaService } from 'ng2-dragula';

import { DragAndDropDomHelper } from './drag-and-drop.dom-helper';
import { IDraggedComponent, INodeOffset } from './drag-and-drop.interface';

@Injectable()
export class DragAndDropComponentPluginFactory {

  constructor(private dragulaService: DragulaService,
              private domHelper: DragAndDropDomHelper,
              private renderer: Renderer2) {
  }

  public createAndAttachTo(component: IDraggedComponent): DragAndDropComponentPlugin {
    return new DragAndDropComponentPlugin(
      component,
      this.dragulaService,
      this.domHelper,
      this.renderer
    );
  }
}

export class DragAndDropComponentPlugin implements OnInit, OnDestroy {

  private _draggedElementPosition: INodeOffset;
  private _isNodeAlreadySwapped: boolean;
  private _clientX: number;
  private _clientY: number;

  private _dragSubscription: Subscription;
  private _dropSubscription: Subscription;
  private _dragEndSubscription: Subscription;

  constructor(private component: IDraggedComponent,
              private dragulaService: DragulaService,
              private domHandler: DragAndDropDomHelper,
              private renderer: Renderer2) {
  }

  onMouseMove(event: MouseEvent): void {
    this._clientX = event.clientX;
    this._clientY = event.clientY;
  }

  ngOnInit(): void {
    this._dragSubscription = this.dragulaService.drag.subscribe(() => this._isNodeAlreadySwapped = false);

    this._dropSubscription = this.dragulaService.drop.subscribe((value: Array<Element>) => {
      this._draggedElementPosition = this.domHandler.getOffset(document.body.getElementsByClassName('gu-mirror')[0]);

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
      const attr: string = this.toNodeId(value[1]);
      this.renderer.removeChild(value[1].parentNode, value[1]);

      if (this._isNodeAlreadySwapped) {
        return;
      }

      const intersectedByTargetElements: Element[] = this.domHandler.getIntersectedByTargetElements(
        this._draggedElementPosition,
        this.component.elementRef.nativeElement.querySelectorAll(this.component.elementSelector)
      );

      if (intersectedByTargetElements.length === 2) {
        // The change location operation can be executed when only two nodes are intersected at the same time
        this.component.changeLocation.emit({
          swap: true,
          target: this.toNodeId(intersectedByTargetElements[0]),
          source: attr
        });
      }
    });
  }

  ngOnDestroy(): void {
    this._dragEndSubscription.unsubscribe();
    this._dropSubscription.unsubscribe();
    this._dragSubscription.unsubscribe();
  }

  private toNodeId(element: Element): string {
    return element.getAttribute('nodeid');
  }
}
