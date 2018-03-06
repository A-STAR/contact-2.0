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
  @ContentChildren(AreaComponent, { descendants: false }) _children: QueryList<AreaComponent>;

  @HostBinding('style.flex-direction')
  @Input()
  layout = IAreaLayout.COLUMN;

  @Input()
  persistenceKey: string;

  private mouseMoveListener: () => void;
  private mouseUpListener: () => void;

  private dragData: IDragData;

  get children(): AreaComponent[] {
    return this._children.filter(c => c !== this);
  }

  set order(order: number) {
    this.renderer.setStyle(this.elRef.nativeElement, 'order', order);
  }

  get gutters(): number[] {
    const n = this.children.length;
    return n > 1 ? range(0, n - 2) : [];
  }

  constructor(
    private cdRef: ChangeDetectorRef,
    private elRef: ElementRef,
    private renderer: Renderer2,
  ) {}

  ngAfterViewInit(): void {
    this.children.forEach((c, i) => c.order = i);
  }

  getSize(direction: IAreaLayout): number {
    const r = this.elRef.nativeElement.getBoundingClientRect();
    return direction === IAreaLayout.ROW
      ? r.width
      : r.height;
  }

  setSize(size: number): void {
    this.renderer.setStyle(this.elRef.nativeElement, 'flex', `0 0 ${size}px`);
  }

  getGutterStyle(i: number): Partial<CSSStyleDeclaration> {
    return {
      order: `${i}`,
    };
  }

  onMouseDown(i: number, event: MouseEvent): void {
    const start = this.layout === IAreaLayout.ROW
      ? event.clientX
      : event.clientY;
    this.dragData = {
      start,
      i,
      a: this.children[i].getSize(this.layout),
      b: this.children[i + 1].getSize(this.layout),
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
    const { i, start, a, b } = this.dragData;

    const size = this.layout === IAreaLayout.ROW
      ? event.clientX - start
      : event.clientY - start;

    this.children[i].setSize(a + size);
    this.children[i + 1].setSize(b - size);
  }
}
