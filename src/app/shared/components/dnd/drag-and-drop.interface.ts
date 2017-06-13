import {
  ElementRef,
  EventEmitter,
  OnChanges,
  OnDestroy,
  OnInit,
  Renderer2
} from '@angular/core';

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

export interface IIntersectedNodeInfo {
  element: Element;
  x1: number;
  x2: number;
  y1: number;
  y2: number
}

export interface IDraggedComponent extends OnInit, OnChanges, OnDestroy {
  changeLocation: EventEmitter<IDragAndDropPayload>;
  elementRef: ElementRef;
  elementSelector: string;
  renderer: Renderer2;
}
