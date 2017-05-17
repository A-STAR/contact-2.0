import { ElementRef, EventEmitter, OnDestroy, OnInit } from '@angular/core';

export interface IDragAndDropPayload {
  swap: boolean;
  source: string;
  target: string;
}

export interface INodeOffset {
  top: number;
  left: number;
  width: number;
  height: number;
}

export interface IDraggedComponent extends OnInit, OnDestroy {
  changeLocation: EventEmitter<IDragAndDropPayload>;
  elementRef: ElementRef;
  elementSelector: string;
}
