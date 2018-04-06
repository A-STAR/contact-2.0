import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  QueryList,
  Renderer2,
} from '@angular/core';

import { IAreaLayout, IDragData } from './area.interface';

import { AreaService } from './area.service';
import { SettingsService } from '@app/core/settings/settings.service';

import { range } from '@app/core/utils';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-area',
  styleUrls: [ './area.component.scss' ],
  templateUrl: './area.component.html',
})
export class AreaComponent implements OnInit, AfterViewInit, OnDestroy {
  private static MIN_SIZE = 100;

  @ContentChildren(AreaComponent, { descendants: false }) _children: QueryList<AreaComponent>;

  @HostBinding('style.flex-direction')
  @Input()
  layout: IAreaLayout;

  @Input()
  persistenceKey: string;

  @Input()
  set initialSize(size: number) {
    this._initialSize = size;
    this.setSize(size);
  }

  parentLayout: IAreaLayout;

  private id: string;
  private rootPersistenceKey: string;

  private dragData: IDragData;

  private _initialSize = 1;

  private mouseMoveListener: () => void;
  private mouseUpListener: () => void;
  private resizeListener: () => void;

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
    private areaService: AreaService,
    private elRef: ElementRef,
    private renderer: Renderer2,
    private settingsService: SettingsService,
  ) {}

  ngOnInit(): void {
    this.settingsService.onClear$.subscribe(() => {
      if (this.persistenceKey) {
        this.areaService.clearState(this.persistenceKey);
      }
      this.setSize(this._initialSize);
    });
  }

  ngAfterViewInit(): void {
    this.children.forEach((c, i) => {
      c.order = 2 * i;
      c.parentLayout = this.layout;
    });

    if (this.persistenceKey) {
      this.restoreState(this.persistenceKey);
      this.resizeListener = this.renderer.listen(window, 'resize', () => this.restoreState(this.persistenceKey));
    }
  }

  ngOnDestroy(): void {
    if (this.resizeListener) {
      this.resizeListener();
    }
  }

  get size(): number {
    const r = this.elRef.nativeElement.getBoundingClientRect();
    return this.parentLayout === IAreaLayout.ROW
      ? r.width
      : r.height;
  }

  set size(size: number) {
    this.setSize(size, false);
    // TODO(d.maltsev): only save state on drag finish
    this.areaService.saveState(this.rootPersistenceKey, this.id, size);
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

    const size = this.areaService.getState(rootPersistenceKey, id);
    this.setSize(size);

    this.children.forEach((c, i) => c.restoreState(rootPersistenceKey, id ? `${id}.${i}` : `${i}`));
  }

  private setSize(size: number, relative: boolean = true): void {
    if (size >= 0) {
      const value = relative ? size : `0 0 ${size}px`;
      this.renderer.setStyle(this.elRef.nativeElement, 'flex', value);
    }
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
    const lSizeUpdated = lSize + size;
    const rSizeUpdated = rSize - size;
    if (lSizeUpdated >= AreaComponent.MIN_SIZE && rSizeUpdated >= AreaComponent.MIN_SIZE) {
      this.children[i].size = lSizeUpdated;
      this.children[i + 1].size = rSizeUpdated;
    }
  }

  private getCoordFromEvent(event: MouseEvent): number {
    return this.layout === IAreaLayout.ROW
      ? event.clientX
      : event.clientY;
  }
}
