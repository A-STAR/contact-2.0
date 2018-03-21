import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  QueryList,
  Renderer2,
} from '@angular/core';

import { IAreaLayout, IDragData } from './area.interface';

import { range } from '@app/core/utils';
import { PersistenceService } from '@app/core/persistence/persistence.service';

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

  @Input()
  set initialSize(size: number) {
    this.renderer.setStyle(this.elRef.nativeElement, 'flex', size);
  }

  parentLayout: IAreaLayout;

  private id: string;
  private rootPersistenceKey: string;

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
    private elRef: ElementRef,
    private persistenceService: PersistenceService,
    private renderer: Renderer2,
  ) {}

  ngAfterViewInit(): void {
    this.children.forEach((c, i) => {
      c.order = 2 * i;
      c.parentLayout = this.layout;
    });

    if (this.persistenceKey) {
      this.restoreState(this.persistenceKey);
    }
  }

  get size(): number {
    const r = this.elRef.nativeElement.getBoundingClientRect();
    return this.parentLayout === IAreaLayout.ROW
      ? r.width
      : r.height;
  }

  set size(size: number) {
    this.renderer.setStyle(this.elRef.nativeElement, 'flex', `0 0 ${size}px`);
    // TODO(d.maltsev): only save state on drag finish
    this.saveState(size);
  }

  getGutterClass(): any {
    return {
      gutter: true,
      horizontal: this.layout === IAreaLayout.COLUMN,
      vertical: this.layout === IAreaLayout.ROW,
    };
  }

  getGutterStyle(i: number): Partial<CSSStyleDeclaration> {
    return {
      order: `${2 * i + 1}`,
    };
  }

  onMouseDown(i: number, event: MouseEvent): void {
    this.dragData = {
      i,
      lSize: this.children[i].size,
      rSize: this.children[i + 1].size,
      start: this.getCoordFromEvent(event),
    };
    this.mouseMoveListener = this.renderer.listen(document, 'mousemove', this.onMouseMove.bind(this));
    this.mouseUpListener = this.renderer.listen(document, 'mouseup', this.onMouseUp.bind(this));
  }

  @HostListener('dragstart')
  @HostListener('selectstart')
  onDragStart(): false {
    return false;
  }

  restoreState(rootPersistenceKey: string, id: string = ''): void {
    this.id = id;
    this.rootPersistenceKey = rootPersistenceKey;

    const state = this.persistenceService.get(this.rootPersistenceKey);
    if (id) {
      const size = state[id];
      if (size) {
        this.renderer.setStyle(this.elRef.nativeElement, 'flex', `0 0 ${size}px`);
      }
    }

    this.children.forEach((c, i) => c.restoreState(rootPersistenceKey, id ? `${id}.${i}` : `${i}`));
  }

  private saveState(size: number): void {
    const state = this.persistenceService.get(this.rootPersistenceKey) || {};
    this.persistenceService.set(this.rootPersistenceKey, { ...state, [this.id]: size });
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
    const { i, start, lSize, rSize } = this.dragData;
    const size = this.getCoordFromEvent(event) - start;
    this.children[i].size = lSize + size;
    this.children[i + 1].size = rSize - size;
  }

  private getCoordFromEvent(event: MouseEvent): number {
    return this.layout === IAreaLayout.ROW
      ? event.clientX
      : event.clientY;
  }
}
