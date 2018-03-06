import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  HostBinding,
  Input,
  QueryList,
  Renderer2,
} from '@angular/core';

import { IAreaLayout, IDragData } from './area.interface';

import { range } from '@app/core/utils';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-area',
  styleUrls: [ './area.component.scss' ],
  templateUrl: './area.component.html',
})
export class AreaComponent implements AfterViewInit {
  @ContentChildren(AreaComponent, { descendants: false }) children: QueryList<AreaComponent>;

  @HostBinding('style.flex-direction')
  @Input()
  layout = IAreaLayout.COLUMN;

  @Input()
  persistenceKey: string;

  private mouseMoveListener: () => void;
  private mouseUpListener: () => void;

  private dragData: IDragData;

  set order(order: number) {
    this.renderer.setStyle(this.elRef.nativeElement, 'order', order);
  }

  get gutters(): number[] {
    const n = this.children.length - 1;
    return n > 1 ? range(0, n - 2) : [];
  }

  constructor(
    private cdRef: ChangeDetectorRef,
    private elRef: ElementRef,
    private renderer: Renderer2,
  ) {}

  ngAfterViewInit(): void {
    this.children.filter(c => c !== this).forEach((c, i) => c.order = i);
  }

  getGutterStyle(i: number): Partial<CSSStyleDeclaration> {
    return {
      order: `${i}`,
    };
  }

  onMouseDown(i: number, event: MouseEvent): void {
    this.dragData = {
      x: event.clientX,
      y: event.clientY,
      i,
    };

    this.mouseMoveListener = this.renderer.listen(this.elRef.nativeElement, 'mousemove', this.onMouseMove.bind(this));
    this.mouseUpListener = this.renderer.listen(this.elRef.nativeElement, 'mouseup', this.onMouseUp.bind(this));
  }

  private onMouseMove(event: MouseEvent): void {
    this.onDrag(event);
  }

  private onMouseUp(event: MouseEvent): void {
    this.onDrag(event);
    this.mouseMoveListener();
    this.mouseUpListener();
  }

  private onDrag(event: MouseEvent): void {
    const x = event.clientX - this.dragData.x;
    const y = event.clientY - this.dragData.y;
    // console.log(x, y);
  }
}
