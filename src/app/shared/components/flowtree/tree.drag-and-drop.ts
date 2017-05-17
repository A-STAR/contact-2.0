import { ElementRef, OnInit, OnDestroy, Renderer2 } from '@angular/core';

import { DragulaService } from 'ng2-dragula';

import { INodeOffset } from './tree.interface';
import { TreeComponent } from './tree.component';
import { DomHandler } from './dom/domhandler';
import { Subscription } from 'rxjs/Subscription';

export class TreeDragAndDropPlugin implements OnInit, OnDestroy {

  private dragulaService: DragulaService;
  private domHandler: DomHandler;
  private elementRef: ElementRef;
  private renderer: Renderer2;

  private _draggedElementPosition: INodeOffset;
  private _isPutted: boolean;
  private _clientX: number;
  private _clientY: number;

  private _dragSubscription: Subscription;
  private _dropSubscription: Subscription;
  private _dragEndSubscription: Subscription;

  constructor(private treeComponent: TreeComponent) {
    this.renderer = treeComponent.renderer;
    this.domHandler = treeComponent.domHandler;
    this.elementRef = treeComponent.elementRef;
    this.dragulaService = treeComponent.dragulaService;
  }

  onMouseMove(event: MouseEvent): void {
    this._clientX = event.clientX;
    this._clientY = event.clientY;
  }

  ngOnInit(): void {
    this._dragSubscription = this.dragulaService.drag.subscribe(() => {
      this._isPutted = false;
    });

    this._dragEndSubscription = this.dragulaService.dragend.subscribe((value) => {
      const attr = value[1].getAttribute('nodeid');
      this.renderer.removeChild(value[1].parentNode, value[1]);

      if (this._isPutted) {
        return;
      }

      const intersectedByTargetElements: Element[] = this.domHandler.getIntersectedByTargetElements(
        this._draggedElementPosition,
        this.elementRef.nativeElement.querySelectorAll('.ui-treenode-content')
      );

      if (intersectedByTargetElements.length === 2) {
        this.treeComponent.changeLocation.emit({
          swap: true,
          target: intersectedByTargetElements[0].getAttribute('nodeid'),
          source: attr
        });
      }
    });

    this._dropSubscription = this.dragulaService.drop.subscribe((value) => {
      this._draggedElementPosition = this.domHandler.getOffset(document.getElementsByClassName('gu-mirror')[0]);

      if (value[1] && value[2]) {
        this.treeComponent.changeLocation.emit({
          swap: false,
          source: value[1].getAttribute('nodeid'),
          target: value[2].getAttribute('nodeid')
        });

        this._isPutted = true;
      }
    });
  }

  ngOnDestroy(): void {
  }
}
